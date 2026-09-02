const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Building = require('./models/Building');
const Complaint = require('./models/Complaint');
const ComplaintTimeline = require('./models/ComplaintTimeline');
const Notice = require('./models/Notice');
const Resource = require('./models/Resource');
const Placement = require('./models/Placement');
const LostFound = require('./models/LostFound');
const EmergencyContact = require('./models/EmergencyContact');
const Equipment = require('./models/Equipment');
const Subject = require('./models/Subject');
const AttendancePolicy = require('./models/AttendancePolicy');
const AttendanceSession = require('./models/AttendanceSession');
const AttendanceRecord = require('./models/AttendanceRecord');
const AttendanceAuditLog = require('./models/AttendanceAuditLog');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusfix');
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Building.deleteMany();
    await Complaint.deleteMany();
    await ComplaintTimeline.deleteMany();
    await Notice.deleteMany();
    await Resource.deleteMany();
    await Placement.deleteMany();
    await LostFound.deleteMany();
    await EmergencyContact.deleteMany();
    await Equipment.deleteMany();
    await Subject.deleteMany();
    await AttendancePolicy.deleteMany();
    await AttendanceSession.deleteMany();
    await AttendanceRecord.deleteMany();
    await AttendanceAuditLog.deleteMany();

    console.log('Cleared old data.');

    // 1. Create Core Users
    const admin = await User.create({
      name: 'Shubham Mishra (Campus Admin)',
      email: process.env.ADMIN_EMAIL || 'admin@campusfix.edu',
      password: process.env.ADMIN_PASSWORD || 'Mishra@123',
      role: 'admin',
      department: 'Administration',
      employeeId: 'ADM-001',
      designation: 'Dean of Student Welfare & Campus Admin',
      phone: '+91 98765 00001'
    });

    const hod = await User.create({
      name: 'Prof. Anjali Verma',
      email: 'hod@campusfix.edu',
      password: 'password123',
      role: 'hod',
      department: 'Computer Science & Engineering',
      employeeId: 'HOD-CSE-101',
      designation: 'Head of Department (CSE)',
      phone: '+91 98765 00002',
      officeLocation: 'Block A - HOD Cabin 201'
    });

    const faculty = await User.create({
      name: 'Dr. Suresh Kumar',
      email: 'faculty@campusfix.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Computer Science & Engineering',
      employeeId: 'FAC-CSE-108',
      designation: 'Associate Professor',
      phone: '+91 98765 00003',
      officeLocation: 'Block A - Room 104',
      consultationHours: 'Mon-Thu 3:00 PM - 5:00 PM'
    });

    const staff = await User.create({
      name: 'Ramesh Electrician',
      email: 'staff@campusfix.edu',
      password: 'password123',
      role: 'staff',
      department: 'Maintenance',
      employeeId: 'MNT-304',
      designation: 'Senior Electrical Technician',
      phone: '+91 98765 00004'
    });

    const teammember = await User.create({
      name: 'Rohan Sharma (Core Lead)',
      email: 'team@campusfix.edu',
      password: 'password123',
      role: 'teammember',
      department: 'Core Operations Committee',
      designation: 'Core Team Lead Coordinator',
      phone: '+91 98765 00006',
      isApproved: true,
      approvalStatus: 'approved'
    });

    const student = await User.create({
      name: 'Aarav Patel',
      email: 'student@campusfix.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: '22CS045',
      phone: '+91 98765 00005',
      hostelBlock: 'Boys Hostel 1',
      roomNumber: 'BH-302'
    });

    console.log('Created Users for all roles: Admin, Team Member, HOD, Faculty, Staff, Student');

    // 2. Create Buildings
    const buildings = await Building.create([
      { code: 'BLK-A', name: 'Academic Block A', category: 'Academic', floors: 4, inChargeName: 'Prof. Anjali Verma', contactPhone: '+91 98765 11111' },
      { code: 'BLK-B', name: 'Academic Block B', category: 'Academic', floors: 4, inChargeName: 'Prof. Vikram Singh', contactPhone: '+91 98765 11112' },
      { code: 'BLK-C', name: 'Academic Block C', category: 'Academic', floors: 3, inChargeName: 'Prof. S. N. Roy', contactPhone: '+91 98765 11113' },
      { code: 'SCI-BLK', name: 'Science Block & Labs', category: 'Laboratory', floors: 3, inChargeName: 'Dr. Meena Iyer', contactPhone: '+91 98765 11114' },
      { code: 'LIB', name: 'Central Library', category: 'Facility', floors: 2, inChargeName: 'Chief Librarian', contactPhone: '+91 98765 11115' },
      { code: 'BH-1', name: 'Boys Hostel 1', category: 'Hostel', floors: 5, inChargeName: 'Warden Rajesh', contactPhone: '+91 98765 11116' },
      { code: 'BH-2', name: 'Boys Hostel 2', category: 'Hostel', floors: 5, inChargeName: 'Warden Anil', contactPhone: '+91 98765 11117' },
      { code: 'GH-1', name: 'Girls Hostel', category: 'Hostel', floors: 4, inChargeName: 'Warden Sunita', contactPhone: '+91 98765 11118' },
      { code: 'CAN', name: 'Central Canteen', category: 'Facility', floors: 1, inChargeName: 'Canteen Manager', contactPhone: '+91 98765 11119' },
      { code: 'ADM', name: 'Admin Block', category: 'Administrative', floors: 3, inChargeName: 'Registrar Office', contactPhone: '+91 98765 11120' }
    ]);

    console.log('Created Campus Buildings');

    // 3. Create Sample Complaints
    const comp1 = await Complaint.create({
      ticketId: 'CF-2026-0001-302',
      title: 'Ceiling Fan malfunction in Room C-204',
      description: 'Room C-204 ka fan 3 din se kharab hai. It makes loud rattling noise and stops randomly.',
      category: 'Electrical',
      building: 'Academic Block C',
      roomNumber: 'C-204',
      priority: 'High',
      status: 'IN_PROGRESS',
      submittedBy: student._id,
      assignedTo: staff._id,
      aiDetected: {
        category: 'Electrical',
        problem: 'Fan malfunction / not working',
        location: 'C-204',
        priority: 'High',
        confidence: 0.94
      }
    });

    await ComplaintTimeline.create([
      { complaintId: comp1._id, status: 'NEW', updatedBy: student._id, remarks: 'Complaint submitted by student' },
      { complaintId: comp1._id, status: 'ASSIGNED', updatedBy: admin._id, remarks: 'Assigned to Senior Technician Ramesh Electrician' },
      { complaintId: comp1._id, status: 'IN_PROGRESS', updatedBy: staff._id, remarks: 'Technician inspected fan capacitor, replacement ordered' }
    ]);

    const comp2 = await Complaint.create({
      ticketId: 'CF-2026-0002-108',
      title: 'Wi-Fi disconnects frequently in Central Library 2nd Floor',
      description: 'The Wi-Fi network CAMPUS_STUDENT drops connection every 5 minutes in reading hall 2.',
      category: 'Internet/Wi-Fi',
      building: 'Central Library',
      roomNumber: '2nd Floor Reading Room',
      priority: 'Medium',
      status: 'NEW',
      submittedBy: student._id,
      aiDetected: {
        category: 'Internet/Wi-Fi',
        problem: 'Wi-Fi connectivity problem',
        location: 'Central Library 2nd Floor',
        priority: 'Medium',
        confidence: 0.91
      }
    });

    await ComplaintTimeline.create([
      { complaintId: comp2._id, status: 'NEW', updatedBy: student._id, remarks: 'Complaint registered' }
    ]);

    const comp3 = await Complaint.create({
      ticketId: 'CF-2026-0003-501',
      title: 'Water tap leaking heavily in Boys Hostel 1 washroom',
      description: 'Ground floor washroom tap 3 is continuously leaking water causing wastage.',
      category: 'Water',
      building: 'Boys Hostel 1',
      roomNumber: 'GF Washroom',
      priority: 'High',
      status: 'RESOLVED',
      submittedBy: student._id,
      assignedTo: staff._id,
      resolvedAt: new Date(Date.now() - 86400000),
      aiDetected: {
        category: 'Water',
        problem: 'Water leakage or shortage',
        location: 'GF Washroom',
        priority: 'High',
        confidence: 0.95
      }
    });

    await ComplaintTimeline.create([
      { complaintId: comp3._id, status: 'NEW', updatedBy: student._id, remarks: 'Complaint submitted' },
      { complaintId: comp3._id, status: 'ASSIGNED', updatedBy: admin._id, remarks: 'Assigned to plumbing staff' },
      { complaintId: comp3._id, status: 'RESOLVED', updatedBy: staff._id, remarks: 'Replaced rubber washer and sealed pipe joint.' }
    ]);

    console.log('Created Sample Complaints & Timelines');

    // 4. Create Notices
    await Notice.create([
      {
        title: 'Mid-Semester Examination Schedule - B.Tech Autumn 2026',
        content: 'Mid-semester examinations for 3rd and 5th semester B.Tech students will commence from Sept 10, 2026. Detailed seating arrangement will be published soon.',
        category: 'Exam',
        priority: 'Important',
        targetAudience: 'Students',
        publishedBy: admin._id
      },
      {
        title: 'Campus Recruitment Drive: TCS Digital & Ninja',
        content: 'TCS is conducting campus placement for 2027 graduating batch. Eligibility: CGPA >= 6.0, no active backlogs. Last date to register is Aug 30, 2026.',
        category: 'Placement',
        priority: 'Urgent',
        targetAudience: 'Students',
        publishedBy: hod._id
      },
      {
        title: 'Independence Day & Campus Holiday Announcement',
        content: 'The college will remain closed on Aug 15 for Independence Day celebration. Flag hoisting ceremony at 8:30 AM near Main Administrative Block.',
        category: 'Holiday',
        priority: 'Normal',
        targetAudience: 'All',
        publishedBy: admin._id
      }
    ]);

    console.log('Created Notices');

    // 5. Create Resources
    await Resource.create([
      {
        title: 'Data Structures & Algorithms - Complete Lecture Notes',
        description: 'Comprehensive notes covering Arrays, Linked Lists, Trees, Graphs, Sorting & Dynamic Programming.',
        semester: 3,
        department: 'Computer Science & Engineering',
        subject: 'Data Structures & Algorithms',
        unit: 'Unit 1-5 Complete',
        type: 'Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: faculty._id,
        downloadsCount: 142
      },
      {
        title: 'Operating Systems Previous Year Question Papers (2021-2025)',
        description: 'Solved PYQs for University End Semester Examination.',
        semester: 4,
        department: 'Computer Science & Engineering',
        subject: 'Operating Systems',
        unit: 'All Units',
        type: 'Previous Year Paper',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: faculty._id,
        downloadsCount: 98
      },
      {
        title: 'Database Management Systems Lab Manual & Experiments',
        description: 'Lab queries in SQL, PL/SQL scripts, and ER diagram assignments.',
        semester: 4,
        department: 'Computer Science & Engineering',
        subject: 'Database Management Systems',
        unit: 'Lab Manual',
        type: 'Lab Manual',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: hod._id,
        downloadsCount: 215
      }
    ]);

    console.log('Created Study Resources');

    // 6. Create Placements & Internships
    await Placement.create([
      {
        companyName: 'Tech Mahindra',
        title: 'Software Engineer Trainee',
        type: 'Placement',
        role: 'Full Stack / Java Developer',
        packageOffered: '6.5 LPA',
        stipend: 'N/A',
        location: 'Pune / Hyderabad',
        eligibility: { cgpa: 6.5, allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'], backlogAllowed: false },
        batch: '2026',
        applicationDeadline: new Date('2026-09-15'),
        registrationLink: 'https://careers.techmahindra.com',
        description: 'Hiring 2026 graduates for Software Engineering roles. Selection process: Online Aptitude + Technical Test + Coding Round + HR Interview.',
        postedBy: hod._id
      },
      {
        companyName: 'Infosys',
        title: 'Systems Engineer & Specialist Programmer',
        type: 'Placement',
        role: 'Systems Engineer',
        packageOffered: '9.5 LPA',
        stipend: 'N/A',
        location: 'Bangalore / Mysore',
        eligibility: { cgpa: 7.0, allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'], backlogAllowed: false },
        batch: '2026',
        applicationDeadline: new Date('2026-09-20'),
        registrationLink: 'https://infytq.onlinetest.com',
        description: 'On-campus recruitment drive for 2026 batch. HackWithInfy top rankers directly interviewed for Specialist Programmer role.',
        postedBy: admin._id
      },
      {
        companyName: 'Google Summer Internship',
        title: 'SWE Intern 2027',
        type: 'Internship',
        role: 'Software Engineering Intern',
        packageOffered: 'N/A',
        stipend: '85,000 / month',
        location: 'Bangalore / Hyderabad / Remote',
        eligibility: { cgpa: 7.5, allowedBranches: ['Computer Science & Engineering', 'Information Technology'], backlogAllowed: false },
        batch: '2027',
        applicationDeadline: new Date('2026-10-01'),
        registrationLink: 'https://buildyourfuture.withgoogle.com',
        description: '10-week summer internship program working directly with Google engineering teams on core infrastructure and cloud products.',
        postedBy: admin._id
      }
    ]);

    console.log('Created Placements & Internships');

    // 7. Create Lost & Found Items
    await LostFound.create([
      {
        type: 'Lost',
        title: 'Blue Boat Earbuds in Charging Case',
        description: 'Lost my blue color Boat Airdopes case near Central Canteen table 4 during lunch time.',
        category: 'Electronics',
        location: 'Central Canteen',
        incidentDate: new Date(Date.now() - 48 * 3600 * 1000),
        status: 'Open',
        contactPhone: '+91 98765 00005',
        reportedBy: student._id
      },
      {
        type: 'Found',
        title: 'College ID Card of CSE Department',
        description: 'Found an ID card belonging to 2nd year student near Block A Stairs.',
        category: 'ID Card / Documents',
        location: 'Academic Block A Ground Floor',
        incidentDate: new Date(Date.now() - 24 * 3600 * 1000),
        status: 'Open',
        contactPhone: '+91 98765 00003',
        reportedBy: faculty._id
      }
    ]);

    console.log('Created Lost & Found items');

    // 8. Create Emergency Contacts
    await EmergencyContact.create([
      { category: 'Medical', title: 'Campus Health Center & Ambulance', personInCharge: 'Dr. V. K. Gupta (Medical Officer)', phone: '+91 98765 99901', alternatePhone: '+91 98765 99902', location: 'Ground Floor, Admin Block Room 12', availableHours: '24/7 Service' },
      { category: 'Security', title: 'Main Gate & Security Control Room', personInCharge: 'Subedar Major R. S. Singh (Chief Security Officer)', phone: '+91 98765 99903', alternatePhone: '+91 98765 99904', location: 'Main Entrance Gate 1', availableHours: '24/7 Guarded' },
      { category: 'Fire', title: 'Campus Fire Safety & Control Unit', personInCharge: 'Fire Officer Inspector Vijay', phone: '+91 98765 99905', location: 'Maintenance Workshop Block', availableHours: '24/7 On Call' },
      { category: 'Electrical', title: 'Electrical Control Room & Generator Room', personInCharge: 'Head Engineer Suresh Power', phone: '+91 98765 99906', location: 'Sub-station Rear Gate 2', availableHours: '6:00 AM - 11:00 PM' },
      { category: 'Administration', title: 'Student Helpdesk & Dean Office', personInCharge: 'Mr. Pradeep Registrar', phone: '+91 98765 99907', location: 'Admin Block First Floor', availableHours: '9:00 AM - 5:00 PM' },
      { category: 'Hostel', title: 'Chief Warden Office & Emergency Helpline', personInCharge: 'Chief Warden Dr. D. P. Singh', phone: '+91 98765 99908', location: 'Boys Hostel 1 Warden Room', availableHours: '24/7 Available' }
    ]);

    console.log('Created Emergency Contacts');

    // 9. Create Sample Campus Equipment (for QR Infrastructure Reporting & Predictive Maintenance)
    await Equipment.deleteMany();
    await Equipment.create([
      {
        equipmentCode: 'C204-PR01',
        name: 'Epson PowerLite HD Classroom Projector',
        category: 'Classroom',
        building: 'Academic Block C',
        floor: '2nd Floor',
        roomNumber: 'Room C-204 (AI & ML Lab)',
        department: 'Computer Science & Engineering',
        installDate: new Date('2022-04-10'),
        warrantyExpiry: new Date('2023-04-10'),
        operatingHours: 4200,
        healthScore: 32,
        riskLevel: 'Critical',
        repairCountLast6Months: 4,
        aiRecommendation: 'High failure probability. Consider replacement instead of another repair: 4 repairs in last 6 months, high operating hours (4,200h), warranty expired, replacement cost-benefit ratio is 1.4x higher than continued repairs.',
        quickIssues: [
          { label: 'Not working / No power', issueType: 'Power Failure', suggestedPriority: 'High' },
          { label: 'Display problem / Color flicker', issueType: 'Optical Lamp Burnout', suggestedPriority: 'High' },
          { label: 'Sound problem / Buzzing audio', issueType: 'Speaker/Amplifier Fault', suggestedPriority: 'Medium' },
          { label: 'Remote missing / Broken cables', issueType: 'Missing Accessories', suggestedPriority: 'Low' },
          { label: 'Other hardware issue', issueType: 'General Defect', suggestedPriority: 'Medium' }
        ]
      },
      {
        equipmentCode: 'LAB102-AC02',
        name: 'Voltas 2-Ton Inverter Split AC',
        category: 'Electrical',
        building: 'Academic Block A',
        floor: '1st Floor',
        roomNumber: 'Computer Lab 102',
        department: 'Information Technology',
        installDate: new Date('2023-02-15'),
        warrantyExpiry: new Date('2024-02-15'),
        operatingHours: 2800,
        healthScore: 58,
        riskLevel: 'At Risk',
        repairCountLast6Months: 2,
        aiRecommendation: 'Preventive maintenance and refrigerant pressure calibration recommended within 7 days.',
        quickIssues: [
          { label: 'Not turning on', issueType: 'Power Failure', suggestedPriority: 'High' },
          { label: 'No cooling / Warm air', issueType: 'Compressor Trip', suggestedPriority: 'High' },
          { label: 'Water dripping from indoor unit', issueType: 'Drainage Clog', suggestedPriority: 'Medium' },
          { label: 'Loud rattling noise', issueType: 'Blower Motor Jam', suggestedPriority: 'Medium' }
        ]
      },
      {
        equipmentCode: 'BH1-F2-WC01',
        name: 'Commercial RO Stainless Steel Water Cooler',
        category: 'Water',
        building: 'Boys Hostel 1',
        floor: '2nd Floor',
        roomNumber: '2nd Floor Corridor Hub',
        department: 'Hostel Facilities',
        installDate: new Date('2023-08-10'),
        warrantyExpiry: new Date('2025-08-10'),
        operatingHours: 1900,
        healthScore: 88,
        riskLevel: 'Healthy',
        repairCountLast6Months: 0,
        aiRecommendation: 'Operating normally. Next scheduled sediment filter replacement in 45 days.',
        quickIssues: [
          { label: 'Not cooling / Warm water', issueType: 'Compressor Inactive', suggestedPriority: 'High' },
          { label: 'Water leaking on floor', issueType: 'Tap Gasket Leak', suggestedPriority: 'High' },
          { label: 'Low water flow rate', issueType: 'Filter Sedimentation', suggestedPriority: 'Medium' },
          { label: 'Strange taste or smell', issueType: 'Carbon Filter Expired', suggestedPriority: 'High' }
        ]
      },
      {
        equipmentCode: 'LIB-AP04',
        name: 'Cisco Catalyst Wi-Fi 6 Enterprise Access Point',
        category: 'Internet/Wi-Fi',
        building: 'Central Library',
        floor: '1st Floor',
        roomNumber: 'Reading Hall A',
        department: 'IT Computer Center',
        installDate: new Date('2024-01-20'),
        warrantyExpiry: new Date('2027-01-20'),
        operatingHours: 950,
        healthScore: 94,
        riskLevel: 'Healthy',
        repairCountLast6Months: 0,
        aiRecommendation: 'Signal throughput is optimal (940 Mbps average). Zero packet loss reported.',
        quickIssues: [
          { label: 'No internet connection', issueType: 'Gateway Offline', suggestedPriority: 'High' },
          { label: 'Frequent disconnection', issueType: 'Channel Interference', suggestedPriority: 'Medium' },
          { label: 'Slow speed / High latency', issueType: 'Bandwidth Congestion', suggestedPriority: 'Medium' },
          { label: 'Authentication login failed', issueType: 'RADIUS Server Defect', suggestedPriority: 'Medium' }
        ]
      },
      {
        equipmentCode: 'A101-FAN03',
        name: 'Havells High-Speed Commercial Ceiling Fan',
        category: 'Electrical',
        building: 'Academic Block A',
        floor: 'Ground Floor',
        roomNumber: 'Lecture Hall 101',
        department: 'General Engineering',
        installDate: new Date('2021-07-05'),
        warrantyExpiry: new Date('2023-07-05'),
        operatingHours: 4800,
        healthScore: 28,
        riskLevel: 'Critical',
        repairCountLast6Months: 5,
        aiRecommendation: 'Severe motor coil degradation & wobbly canopy. Replace unit immediately to prevent accidental detachment hazard.',
        quickIssues: [
          { label: 'Not spinning / Dead motor', issueType: 'Coil Burnout', suggestedPriority: 'High' },
          { label: 'Sparks / Burning smell', issueType: 'Dangerous Surge', suggestedPriority: 'Emergency' },
          { label: 'Wobbly & shaking dangerously', issueType: 'Mechanical Shaft Defect', suggestedPriority: 'High' },
          { label: 'Speed regulator not working', issueType: 'Regulator Failure', suggestedPriority: 'Low' }
        ]
      }
    ]);

    console.log('Created Sample Campus Equipment');

    // 10. Create Core Academic Subjects
    const subDBMS = await Subject.create({
      code: 'CS501',
      name: 'Database Management Systems (DBMS)',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 4,
      faculty: faculty._id,
      totalPlannedClasses: 45
    });

    const subOS = await Subject.create({
      code: 'CS502',
      name: 'Operating Systems & System Programming',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 4,
      faculty: faculty._id,
      totalPlannedClasses: 42
    });

    const subCN = await Subject.create({
      code: 'CS503',
      name: 'Computer Networks & Security',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 4,
      faculty: hod._id,
      totalPlannedClasses: 40
    });

    const subJava = await Subject.create({
      code: 'CS504',
      name: 'Advanced Java & Web Engineering',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 3,
      faculty: faculty._id,
      totalPlannedClasses: 38
    });

    const subMaths = await Subject.create({
      code: 'BS501',
      name: 'Discrete Mathematics & Graph Theory',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 4,
      faculty: hod._id,
      totalPlannedClasses: 45
    });

    console.log('Created Academic Subjects');

    // 11. Create Attendance Policy
    await AttendancePolicy.create({
      institutionName: 'Engineering College Campus',
      minAttendancePercent: 75,
      warningThresholdPercent: 80,
      criticalThresholdPercent: 75,
      lockDurationHours: 24,
      qrSessionDurationMinutes: 5,
      locationVerificationEnabled: true,
      collegeGeoLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
        radiusMeters: 250
      },
      calculationRules: {
        presentWeight: 1,
        lateWeight: 0.5,
        onDutyCountsAsPresent: true,
        excusedExcludedFromTotal: true
      },
      parentNotificationEnabled: true,
      updatedBy: admin._id
    });

    console.log('Created Attendance Policy');

    // 12. Create Historical Attendance Sessions & Student Records for the month
    const studentList = await User.find({ role: 'student' });
    const primaryStudent = student; // student@campusfix.edu (Aarav Patel)

    // Generate past 20 class sessions across DBMS, OS, CN, Java, Maths
    const subjectsArray = [
      { sub: subDBMS, targetPct: 88 },
      { sub: subOS, targetPct: 68 }, // Low attendance warning test case (< 75%)
      { sub: subCN, targetPct: 85 },
      { sub: subJava, targetPct: 92 },
      { sub: subMaths, targetPct: 76 }
    ];

    for (let i = 20; i >= 1; i--) {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() - i);
      sessionDate.setHours(9 + (i % 4), 0, 0, 0);

      const targetSubjectConfig = subjectsArray[i % subjectsArray.length];
      const currentSubject = targetSubjectConfig.sub;

      const session = await AttendanceSession.create({
        subject: currentSubject._id,
        faculty: currentSubject.faculty,
        department: 'Computer Science & Engineering',
        semester: 5,
        section: 'A',
        date: sessionDate,
        lectureSlot: `0${9 + (i % 4)}:00 AM - ${10 + (i % 4)}:00 AM`,
        roomNumber: i % 2 === 0 ? 'Room C-201' : 'Lab 3',
        topicCovered: `Lecture Unit ${(i % 5) + 1}: Core Concepts & Applications`,
        sessionType: i % 3 === 0 ? 'QR' : 'MANUAL',
        isEnded: true,
        isLocked: true,
        totalStudents: studentList.length || 1,
        presentCount: Math.round((studentList.length || 1) * 0.85),
        absentCount: Math.round((studentList.length || 1) * 0.15),
        attendancePercentage: 85
      });

      // Insert attendance records for students
      for (const st of studentList) {
        let status = 'PRESENT';
        // For primary student, ensure targetPct distribution
        if (st._id.toString() === primaryStudent._id.toString()) {
          const rand = Math.random() * 100;
          if (rand > targetSubjectConfig.targetPct) {
            status = i % 7 === 0 ? 'LATE' : 'ABSENT';
          } else {
            status = i % 11 === 0 ? 'ON_DUTY' : 'PRESENT';
          }
        } else {
          status = Math.random() > 0.15 ? 'PRESENT' : 'ABSENT';
        }

        await AttendanceRecord.create({
          session: session._id,
          student: st._id,
          faculty: currentSubject.faculty,
          subject: currentSubject._id,
          department: session.department,
          semester: session.semester,
          section: session.section,
          date: sessionDate,
          status,
          markedVia: session.sessionType === 'QR' ? 'QR_SCAN' : 'MANUAL_FACULTY',
          isLocked: true
        });
      }
    }

    console.log('Created Historical Attendance Sessions & Records');

    console.log('=================================================');
    console.log(' Database Seeded Successfully!');
    console.log(' Ready to use accounts:');
    console.log(' Admin:   admin@campusfix.edu / Mishra@123');
    console.log(' Student: student@campusfix.edu / password123');
    console.log(' Faculty: faculty@campusfix.edu / password123');
    console.log(' Staff:   staff@campusfix.edu   / password123');
    console.log(' HOD:     hod@campusfix.edu     / password123');
    console.log('=================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
