const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendancePolicy = require('../models/AttendancePolicy');
const AttendanceAuditLog = require('../models/AttendanceAuditLog');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Notification = require('../models/Notification');
const crypto = require('crypto');

// Helper to get active policy
const getActivePolicy = async () => {
  let policy = await AttendancePolicy.findOne();
  if (!policy) {
    policy = await AttendancePolicy.create({
      institutionName: 'Engineering College Campus',
      minAttendancePercent: 75,
      warningThresholdPercent: 80,
      criticalThresholdPercent: 75,
      lockDurationHours: 24,
      qrSessionDurationMinutes: 5,
      locationVerificationEnabled: false,
      calculationRules: {
        presentWeight: 1,
        lateWeight: 0.5,
        onDutyCountsAsPresent: true,
        excusedExcludedFromTotal: true
      }
    });
  }
  return policy;
};

// Helper: Calculate distance in meters between two lat/lng pairs
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 1. GET /api/attendance/policy
exports.getPolicy = async (req, res) => {
  try {
    const policy = await getActivePolicy();
    res.json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. PUT /api/attendance/policy (Admin only)
exports.updatePolicy = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only Admin can update attendance policy.' });
    }

    const previous = await getActivePolicy();
    const updated = await AttendancePolicy.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: req.user._id },
      { new: true, upsert: true }
    );

    // Log audit
    await AttendanceAuditLog.create({
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      action: 'POLICY_UPDATED',
      details: 'Attendance policy thresholds or lock duration updated',
      previousValue: previous,
      newValue: updated,
      ipAddress: req.ip
    });

    res.json({ success: true, message: 'Attendance policy updated successfully', policy: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET /api/attendance/subjects
exports.getSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;
    let filter = {};
    if (department && department !== 'All') filter.department = department;
    if (semester) filter.semester = Number(semester);
    if (req.user.role === 'faculty') {
      filter.$or = [{ faculty: req.user._id }, { department: req.user.department }];
    }

    const subjects = await Subject.find(filter).populate('faculty', 'name email employeeId designation');
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. POST /api/attendance/subjects (Admin / HOD)
exports.createSubject = async (req, res) => {
  try {
    const { code, name, department, semester, credits, facultyId, totalPlannedClasses } = req.body;
    const subject = await Subject.create({
      code,
      name,
      department: department || req.user.department,
      semester: Number(semester) || 5,
      credits: Number(credits) || 4,
      faculty: facultyId || null,
      totalPlannedClasses: Number(totalPlannedClasses) || 45
    });

    res.status(201).json({ success: true, message: 'Subject created successfully', subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET /api/attendance/faculty/schedule
exports.getFacultySchedule = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get subjects taught by faculty
    const subjects = await Subject.find({ faculty: facultyId });
    
    // Find today's sessions marked by this faculty
    const sessionsToday = await AttendanceSession.find({
      faculty: facultyId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('subject', 'name code department semester');

    // Default lecture slots template
    const defaultSlots = [
      { slot: '09:00 AM - 10:00 AM', room: 'Room C-201', subject: subjects[0] || null, section: 'A' },
      { slot: '10:00 AM - 11:00 AM', room: 'Room C-201', subject: subjects[1] || subjects[0] || null, section: 'A' },
      { slot: '11:15 AM - 12:15 PM', room: 'Lab 3', subject: subjects[2] || subjects[0] || null, section: 'B' },
      { slot: '02:00 PM - 03:00 PM', room: 'Room C-204', subject: subjects[0] || null, section: 'B' }
    ];

    const schedule = defaultSlots.map((item, idx) => {
      const match = sessionsToday.find(s => s.lectureSlot === item.slot);
      return {
        id: `slot-${idx + 1}`,
        lectureSlot: item.slot,
        roomNumber: match ? match.roomNumber : item.room,
        section: match ? match.section : item.section,
        subject: match ? match.subject : item.subject,
        session: match || null,
        status: match ? (match.isEnded ? 'COMPLETED' : 'IN_PROGRESS') : 'PENDING'
      };
    });

    res.json({ success: true, schedule, sessionsToday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. GET /api/attendance/class-students
exports.getClassStudents = async (req, res) => {
  try {
    const { department, semester, section } = req.query;
    let filter = { role: 'student' };
    if (department && department !== 'All') filter.department = department;

    const students = await User.find(filter).select('name email rollNumber department phone avatar').sort('rollNumber');
    res.json({ success: true, students, count: students.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. POST /api/attendance/mark (Manual Attendance Creation & Bulk Marking)
exports.markManualAttendance = async (req, res) => {
  try {
    const {
      subjectId,
      department,
      semester,
      section,
      date,
      lectureSlot,
      roomNumber,
      topicCovered,
      attendanceList // Array: [{ studentId, status: 'PRESENT'|'ABSENT'|'LATE'|'EXCUSED'|'ON_DUTY', remarks }]
    } = req.body;

    if (!subjectId || !attendanceList || attendanceList.length === 0) {
      return res.status(400).json({ success: false, message: 'Subject and attendance list are required.' });
    }

    const sessionDate = date ? new Date(date) : new Date();
    
    // Count stats
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let onDutyCount = 0;

    attendanceList.forEach(item => {
      if (item.status === 'PRESENT') presentCount++;
      else if (item.status === 'ABSENT') absentCount++;
      else if (item.status === 'LATE') lateCount++;
      else if (item.status === 'EXCUSED') excusedCount++;
      else if (item.status === 'ON_DUTY') onDutyCount++;
    });

    const totalStudents = attendanceList.length;
    const policy = await getActivePolicy();
    const applicable = policy.calculationRules.excusedExcludedFromTotal ? (totalStudents - excusedCount) : totalStudents;
    const weightedPresent = presentCount + (lateCount * policy.calculationRules.lateWeight) + (policy.calculationRules.onDutyCountsAsPresent ? onDutyCount : 0);
    const attendancePercentage = applicable > 0 ? Number(((weightedPresent / applicable) * 100).toFixed(1)) : 100;

    // Create or Update Session
    const session = await AttendanceSession.create({
      subject: subjectId,
      faculty: req.user._id,
      department: department || req.user.department,
      semester: Number(semester) || 5,
      section: section || 'A',
      date: sessionDate,
      lectureSlot: lectureSlot || '09:00 AM - 10:00 AM',
      roomNumber: roomNumber || 'Room 204',
      topicCovered: topicCovered || 'Coursework Lecture',
      sessionType: 'MANUAL',
      isEnded: true,
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      onDutyCount,
      attendancePercentage
    });

    // Bulk Insert Attendance Records
    const recordsToInsert = attendanceList.map(item => ({
      session: session._id,
      student: item.studentId,
      faculty: req.user._id,
      subject: subjectId,
      department: session.department,
      semester: session.semester,
      section: session.section,
      date: sessionDate,
      status: item.status || 'PRESENT',
      markedVia: 'MANUAL_FACULTY',
      remarks: item.remarks || ''
    }));

    await AttendanceRecord.insertMany(recordsToInsert);

    // Audit Log
    await AttendanceAuditLog.create({
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      action: 'ATTENDANCE_MARKED',
      session: session._id,
      subject: subjectId,
      details: `Manual attendance marked for ${totalStudents} students. Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}.`,
      ipAddress: req.ip
    });

    // Trigger low attendance alert notifications for absent students if threshold is breached
    const absentStudentIds = attendanceList.filter(a => a.status === 'ABSENT').map(a => a.studentId);
    if (absentStudentIds.length > 0) {
      for (const stId of absentStudentIds) {
        // compute student's overall attendance in this subject
        const allRecords = await AttendanceRecord.find({ student: stId, subject: subjectId });
        const total = allRecords.length;
        const present = allRecords.filter(r => r.status === 'PRESENT' || r.status === 'ON_DUTY').length;
        const pct = total > 0 ? (present / total) * 100 : 100;

        if (pct < policy.criticalThresholdPercent) {
          await Notification.create({
            recipient: stId,
            sender: req.user._id,
            title: `⚠️ Attendance Warning in ${session.topicCovered}`,
            message: `Your current attendance in subject is ${pct.toFixed(1)}%, which is below the mandatory ${policy.minAttendancePercent}% threshold. Please attend upcoming lectures.`,
            type: 'announcement'
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Attendance saved successfully',
      session,
      summary: {
        totalStudents,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        onDutyCount,
        attendancePercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. GET /api/attendance/student-summary (Student Dashboard Analytics)
exports.getStudentAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.query.studentId || (req.user.role === 'student' ? req.user._id : req.query.studentId);
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required.' });
    }

    const policy = await getActivePolicy();
    const records = await AttendanceRecord.find({ student: studentId })
      .populate('subject', 'name code credits totalPlannedClasses')
      .populate('faculty', 'name email')
      .sort({ date: -1 });

    const totalClasses = records.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let onDutyCount = 0;

    // Group records by subject
    const subjectMap = {};

    records.forEach(r => {
      const subId = r.subject ? r.subject._id.toString() : 'general';
      const subName = r.subject ? r.subject.name : 'General Subject';
      const subCode = r.subject ? r.subject.code : 'GEN';

      if (!subjectMap[subId]) {
        subjectMap[subId] = {
          subjectId: subId,
          subjectName: subName,
          subjectCode: subCode,
          facultyName: r.faculty ? r.faculty.name : 'Faculty',
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          onDuty: 0,
          records: []
        };
      }

      const sm = subjectMap[subId];
      sm.total++;
      sm.records.push(r);

      if (r.status === 'PRESENT') {
        presentCount++;
        sm.present++;
      } else if (r.status === 'ABSENT') {
        absentCount++;
        sm.absent++;
      } else if (r.status === 'LATE') {
        lateCount++;
        sm.late++;
      } else if (r.status === 'EXCUSED') {
        excusedCount++;
        sm.excused++;
      } else if (r.status === 'ON_DUTY') {
        onDutyCount++;
        sm.onDuty++;
      }
    });

    const applicableTotal = policy.calculationRules.excusedExcludedFromTotal ? (totalClasses - excusedCount) : totalClasses;
    const weightedPresent = presentCount + (lateCount * policy.calculationRules.lateWeight) + (policy.calculationRules.onDutyCountsAsPresent ? onDutyCount : 0);
    const overallPercentage = applicableTotal > 0 ? Number(((weightedPresent / applicableTotal) * 100).toFixed(1)) : 100;

    // Format Subject-wise cards with dynamic "Classes Needed" prediction
    const subjectBreakdown = Object.values(subjectMap).map(s => {
      const app = policy.calculationRules.excusedExcludedFromTotal ? (s.total - s.excused) : s.total;
      const wp = s.present + (s.late * policy.calculationRules.lateWeight) + (policy.calculationRules.onDutyCountsAsPresent ? s.onDuty : 0);
      const pct = app > 0 ? Number(((wp / app) * 100).toFixed(1)) : 100;

      // Dynamic calculation: classes needed to reach target threshold (75% or 80%)
      const target = policy.minAttendancePercent / 100;
      let classesNeededToReachTarget = 0;
      if (pct < policy.minAttendancePercent) {
        classesNeededToReachTarget = Math.ceil((target * app - wp) / (1 - target));
        if (classesNeededToReachTarget < 0) classesNeededToReachTarget = 0;
      }

      // Max classes student can afford to miss while staying >= 75%
      let maxClassesCanMiss = 0;
      if (pct >= policy.minAttendancePercent) {
        maxClassesCanMiss = Math.floor((wp - target * app) / target);
        if (maxClassesCanMiss < 0) maxClassesCanMiss = 0;
      }

      return {
        ...s,
        percentage: pct,
        statusLabel: pct >= 90 ? 'Excellent' : pct >= 80 ? 'Good' : pct >= 75 ? 'Warning' : 'Critical Shortage',
        statusColor: pct >= 80 ? 'emerald' : pct >= 75 ? 'amber' : 'rose',
        classesNeededToReachTarget,
        maxClassesCanMiss,
        isShortage: pct < policy.minAttendancePercent
      };
    });

    // Calculate Streak (consecutive present sessions)
    let currentStreak = 0;
    for (const r of records) {
      if (r.status === 'PRESENT' || r.status === 'ON_DUTY') {
        currentStreak++;
      } else if (r.status === 'ABSENT') {
        break;
      }
    }

    // Prediction Engine: If attends next 8 classes vs if misses next 3 classes
    const simAttends = Number((((weightedPresent + 8) / (applicableTotal + 8)) * 100).toFixed(1));
    const simMisses = Number(((weightedPresent / (applicableTotal + 3)) * 100).toFixed(1));

    res.json({
      success: true,
      summary: {
        overallPercentage,
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        onDutyCount,
        currentStreak,
        policy: {
          minAttendancePercent: policy.minAttendancePercent,
          warningThresholdPercent: policy.warningThresholdPercent,
          criticalThresholdPercent: policy.criticalThresholdPercent
        },
        forecast: {
          current: overallPercentage,
          riskLevel: overallPercentage < 75 ? 'HIGH_RISK' : overallPercentage < 80 ? 'MODERATE_RISK' : 'SAFE',
          ifAttendsNext8: simAttends,
          ifMissesNext3: simMisses
        },
        subjectBreakdown,
        recentRecords: records.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. GET /api/attendance/history (Chronological List with filters)
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { studentId, subjectId, status, startDate, endDate, page = 1, limit = 30 } = req.query;
    let filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (studentId) {
      filter.student = studentId;
    }

    if (subjectId && subjectId !== 'All') filter.subject = subjectId;
    if (status && status !== 'All') filter.status = status;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AttendanceRecord.countDocuments(filter);
    const records = await AttendanceRecord.find(filter)
      .populate('subject', 'name code')
      .populate('faculty', 'name email designation')
      .populate('student', 'name rollNumber email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      records,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. GET /api/attendance/calendar (Monthly Grid View)
exports.getMonthlyCalendar = async (req, res) => {
  try {
    const { year, month, studentId } = req.query;
    const targetStudent = req.user.role === 'student' ? req.user._id : (studentId || req.user._id);

    const yr = Number(year) || new Date().getFullYear();
    const mo = Number(month) || (new Date().getMonth() + 1);

    const startOfMonth = new Date(yr, mo - 1, 1);
    const endOfMonth = new Date(yr, mo, 0, 23, 59, 59);

    const records = await AttendanceRecord.find({
      student: targetStudent,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('subject', 'name code');

    // Group records by day of month (1 to 31)
    const calendarDays = {};
    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      calendarDays[d] = {
        day: d,
        date: new Date(yr, mo - 1, d),
        records: [],
        statusSummary: 'NO_CLASS' // 'ALL_PRESENT', 'PARTIAL', 'ALL_ABSENT'
      };
    }

    records.forEach(r => {
      const dayNum = new Date(r.date).getDate();
      if (calendarDays[dayNum]) {
        calendarDays[dayNum].records.push(r);
      }
    });

    Object.values(calendarDays).forEach(cd => {
      if (cd.records.length > 0) {
        const hasAbsent = cd.records.some(r => r.status === 'ABSENT');
        const hasPresent = cd.records.some(r => r.status === 'PRESENT' || r.status === 'ON_DUTY');
        const hasLate = cd.records.some(r => r.status === 'LATE');

        if (hasAbsent && hasPresent) cd.statusSummary = 'PARTIAL';
        else if (hasAbsent) cd.statusSummary = 'ALL_ABSENT';
        else if (hasLate) cd.statusSummary = 'LATE';
        else cd.statusSummary = 'ALL_PRESENT';
      }
    });

    res.json({
      success: true,
      year: yr,
      month: mo,
      days: Object.values(calendarDays)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. POST /api/attendance/qr/start (Faculty starts QR session)
exports.startQRSession = async (req, res) => {
  try {
    const { subjectId, department, semester, section, lectureSlot, roomNumber, durationMinutes } = req.body;
    const policy = await getActivePolicy();
    const duration = Number(durationMinutes) || policy.qrSessionDurationMinutes || 5;

    // Generate secure dynamic token
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);

    const session = await AttendanceSession.create({
      subject: subjectId,
      faculty: req.user._id,
      department: department || req.user.department,
      semester: Number(semester) || 5,
      section: section || 'A',
      date: new Date(),
      lectureSlot: lectureSlot || '09:00 AM - 10:00 AM',
      roomNumber: roomNumber || 'Room C-201',
      sessionType: 'QR',
      qrToken: token,
      qrExpiresAt: expiresAt,
      isEnded: false
    });

    await AttendanceAuditLog.create({
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      action: 'QR_SESSION_STARTED',
      session: session._id,
      subject: subjectId,
      details: `Live QR attendance session started. Token expires in ${duration} mins.`,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'QR Attendance Session Active',
      sessionId: session._id,
      token,
      expiresAt,
      durationMinutes: duration,
      roomNumber: session.roomNumber
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 12. POST /api/attendance/qr/verify (Student scans QR)
exports.verifyQRAttendance = async (req, res) => {
  try {
    const { token, latitude, longitude } = req.body;
    const studentId = req.user._id;

    if (!token) {
      return res.status(400).json({ success: false, message: 'QR Token is required.' });
    }

    const session = await AttendanceSession.findOne({
      qrToken: token,
      isEnded: false
    }).populate('subject', 'name code');

    if (!session) {
      return res.status(400).json({ success: false, message: 'Invalid or ended attendance session.' });
    }

    // Check token expiry
    if (new Date() > new Date(session.qrExpiresAt)) {
      return res.status(400).json({ success: false, message: 'This QR code session has expired. Please ask faculty for assistance.' });
    }

    // Anti-Proxy Check: Prevent duplicate scan by same student
    const existing = await AttendanceRecord.findOne({ session: session._id, student: studentId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already marked attendance for this active lecture.' });
    }

    // Optional Geolocation Verification
    const policy = await getActivePolicy();
    let isGeoVerified = true;
    let distance = 0;

    if (policy.locationVerificationEnabled && latitude && longitude) {
      const colLat = policy.collegeGeoLocation.latitude;
      const colLon = policy.collegeGeoLocation.longitude;
      distance = calculateDistance(latitude, longitude, colLat, colLon);

      if (distance > policy.collegeGeoLocation.radiusMeters) {
        return res.status(403).json({
          success: false,
          message: `Location verification failed: You are ${Math.round(distance)}m away from campus bounds (Max allowed: ${policy.collegeGeoLocation.radiusMeters}m).`
        });
      }
    }

    // Create student attendance record
    const record = await AttendanceRecord.create({
      session: session._id,
      student: studentId,
      faculty: session.faculty,
      subject: session.subject._id,
      department: session.department,
      semester: session.semester,
      section: session.section,
      date: session.date,
      status: 'PRESENT',
      markedVia: 'QR_SCAN',
      geoLocation: {
        latitude,
        longitude,
        isVerified: isGeoVerified,
        distanceMeters: Math.round(distance)
      },
      deviceMetadata: {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip
      }
    });

    // Update Session live counts
    await AttendanceSession.findByIdAndUpdate(session._id, {
      $inc: { presentCount: 1, totalStudents: 1 }
    });

    res.status(201).json({
      success: true,
      message: `🎉 Attendance marked present for ${session.subject.name}!`,
      subject: session.subject.name,
      roomNumber: session.roomNumber,
      markedAt: record.createdAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 13. POST /api/attendance/qr/end (Faculty ends QR session)
exports.endQRSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // Lock and finalize session
    session.isEnded = true;
    session.qrToken = null;
    await session.save();

    await AttendanceAuditLog.create({
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      action: 'QR_SESSION_ENDED',
      session: session._id,
      subject: session.subject,
      details: `QR attendance session ended. Total marked: ${session.presentCount}.`,
      ipAddress: req.ip
    });

    res.json({ success: true, message: 'QR session successfully concluded', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 14. PATCH /api/attendance/record/:id (Edit Attendance Record with Audit Trail & Lock checking)
exports.editAttendanceRecord = async (req, res) => {
  try {
    const { newStatus, reason } = req.body;
    const recordId = req.params.id;

    if (!newStatus || !reason) {
      return res.status(400).json({ success: false, message: 'New status and reason are mandatory for attendance audits.' });
    }

    const record = await AttendanceRecord.findById(recordId)
      .populate('session')
      .populate('student', 'name rollNumber');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    // Check Lock Duration
    const policy = await getActivePolicy();
    const hoursElapsed = (Date.now() - new Date(record.createdAt).getTime()) / (1000 * 60 * 60);

    if (hoursElapsed > policy.lockDurationHours && !['admin', 'hod'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `🔒 Attendance Locked: Edits are locked after ${policy.lockDurationHours} hours. Please contact HOD or Admin for authorization.`
      });
    }

    const oldStatus = record.status;
    record.status = newStatus;
    record.auditHistory.push({
      changedBy: req.user._id,
      changedByName: req.user.name,
      oldStatus,
      newStatus,
      reason,
      changedAt: new Date()
    });

    await record.save();

    // Log in global audit log
    await AttendanceAuditLog.create({
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      action: 'ATTENDANCE_EDITED',
      student: record.student._id,
      subject: record.subject,
      session: record.session?._id,
      details: `Status changed for student ${record.student.name} from ${oldStatus} to ${newStatus}. Reason: "${reason}"`,
      previousValue: { status: oldStatus },
      newValue: { status: newStatus },
      ipAddress: req.ip
    });

    res.json({ success: true, message: `Attendance updated to ${newStatus}`, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 15. GET /api/attendance/analytics (HOD & Admin Department-wide intelligence)
exports.getDepartmentAnalytics = async (req, res) => {
  try {
    const { department = req.user.department || 'Computer Science & Engineering' } = req.query;
    const policy = await getActivePolicy();

    // Fetch all records for this department
    const records = await AttendanceRecord.find({ department })
      .populate('subject', 'name code')
      .populate('student', 'name rollNumber email');

    const totalStudents = await User.countDocuments({ role: 'student', department });
    const totalSessions = await AttendanceSession.countDocuments({ department });

    let present = 0;
    let absent = 0;
    let late = 0;

    const studentMap = {};
    const subjectMap = {};

    records.forEach(r => {
      if (r.status === 'PRESENT' || r.status === 'ON_DUTY') present++;
      else if (r.status === 'ABSENT') absent++;
      else if (r.status === 'LATE') late++;

      // Student aggregation
      const stId = r.student ? r.student._id.toString() : 'unknown';
      if (!studentMap[stId] && r.student) {
        studentMap[stId] = {
          id: stId,
          name: r.student.name,
          rollNumber: r.student.rollNumber,
          total: 0,
          present: 0
        };
      }
      if (studentMap[stId]) {
        studentMap[stId].total++;
        if (r.status === 'PRESENT' || r.status === 'ON_DUTY') studentMap[stId].present++;
      }

      // Subject aggregation
      const subName = r.subject ? r.subject.name : 'Other';
      if (!subjectMap[subName]) {
        subjectMap[subName] = { subjectName: subName, total: 0, present: 0 };
      }
      subjectMap[subName].total++;
      if (r.status === 'PRESENT' || r.status === 'ON_DUTY') subjectMap[subName].present++;
    });

    const totalRecords = records.length;
    const avgAttendance = totalRecords > 0 ? Number(((present / totalRecords) * 100).toFixed(1)) : 85;

    // Identify At-Risk & Defaulter Students (< 75%)
    const atRiskStudents = Object.values(studentMap)
      .map(s => ({
        ...s,
        percentage: s.total > 0 ? Number(((s.present / s.total) * 100).toFixed(1)) : 100
      }))
      .filter(s => s.percentage < policy.criticalThresholdPercent);

    // Subject breakdown
    const subjectBreakdown = Object.values(subjectMap).map(s => ({
      name: s.subjectName,
      attendance: s.total > 0 ? Number(((s.present / s.total) * 100).toFixed(1)) : 85,
      totalClasses: s.total
    }));

    // Semester Comparison
    const semesterData = [
      { semester: 'Sem 3', attendance: 84 },
      { semester: 'Sem 4', attendance: 78 },
      { semester: 'Sem 5', attendance: 86 },
      { semester: 'Sem 6', attendance: 81 },
      { semester: 'Sem 7', attendance: 88 }
    ];

    // Smart data-driven insights
    const insights = [
      `Overall department attendance is currently at ${avgAttendance}%.`,
      `${atRiskStudents.length} students are currently below the ${policy.minAttendancePercent}% threshold and require academic counsel.`,
      subjectBreakdown.length > 0
        ? `${subjectBreakdown[0].name} has recorded the highest engagement rate.`
        : 'Class attendance records are being captured steadily.'
    ];

    res.json({
      success: true,
      analytics: {
        department,
        totalStudents,
        totalSessions,
        averageAttendance: avgAttendance,
        atRiskCount: atRiskStudents.length,
        atRiskStudents: atRiskStudents.slice(0, 10),
        subjectBreakdown,
        semesterData,
        insights
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 16. GET /api/attendance/reports (Dynamic Report Generator)
exports.generateAttendanceReport = async (req, res) => {
  try {
    const { department, semester, section, subjectId, status, format } = req.query;
    let filter = {};

    if (department && department !== 'All') filter.department = department;
    if (semester && semester !== 'All') filter.semester = Number(semester);
    if (section && section !== 'All') filter.section = section;
    if (subjectId && subjectId !== 'All') filter.subject = subjectId;
    if (status && status !== 'All') filter.status = status;

    const records = await AttendanceRecord.find(filter)
      .populate('student', 'name rollNumber email')
      .populate('subject', 'name code')
      .populate('faculty', 'name')
      .sort({ date: -1 });

    if (format === 'csv') {
      const headers = 'Date,Student Name,Roll Number,Subject,Status,Marked By,Remarks\n';
      const rows = records.map(r => 
        `"${new Date(r.date).toLocaleDateString()}","${r.student?.name || ''}","${r.student?.rollNumber || ''}","${r.subject?.name || ''}","${r.status}","${r.faculty?.name || ''}","${r.remarks || ''}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.csv"');
      return res.send(headers + rows);
    }

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 17. GET /api/attendance/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AttendanceAuditLog.find()
      .populate('performedBy', 'name email role')
      .populate('student', 'name rollNumber')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
