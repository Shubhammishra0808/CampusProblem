const Equipment = require('../models/Equipment');
const Complaint = require('../models/Complaint');
const { calculateEquipmentHealth, recommendStaffAssignment } = require('../services/aiService');
const { generateTicketId, addTimelineEntry } = require('../services/complaintService');
const { createNotification } = require('../services/notificationService');
const User = require('../models/User');

// @desc    Get all equipment with predictive health scores
// @route   GET /api/equipment
// @access  Private
const getAllEquipment = async (req, res) => {
  try {
    const equipmentList = await Equipment.find().sort({ healthScore: 1 });

    const enriched = equipmentList.map(item => {
      const health = calculateEquipmentHealth(item);
      return {
        ...item.toObject(),
        healthScore: health.healthScore,
        riskLevel: health.riskLevel,
        diagnosticReasons: health.reasons,
        aiRecommendation: health.recommendation
      };
    });

    res.json({
      success: true,
      equipment: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get equipment details by QR Code (e.g. C204-PR01)
// @route   GET /api/equipment/qr/:code
// @access  Public / Private
const getEquipmentByQR = async (req, res) => {
  try {
    const rawCode = req.params.code.toUpperCase().trim();
    let equipment = await Equipment.findOne({ equipmentCode: rawCode });

    // If not found in DB, provide standard smart defaults
    if (!equipment) {
      if (rawCode.includes('PR') || rawCode.includes('PROJ')) {
        equipment = {
          equipmentCode: rawCode,
          name: `Classroom High-Definition Projector (${rawCode})`,
          category: 'Classroom',
          building: 'Academic Block C',
          floor: '2nd Floor',
          roomNumber: 'Room C-204',
          healthScore: 32,
          riskLevel: 'Critical',
          quickIssues: [
            { label: 'Not working / No power', issueType: 'Power Failure', suggestedPriority: 'High' },
            { label: 'Display problem / Color distortion', issueType: 'Optical Lamp Degradation', suggestedPriority: 'High' },
            { label: 'Sound problem / Buzzing audio', issueType: 'Speaker/Amplifier Fault', suggestedPriority: 'Medium' },
            { label: 'Remote missing / Broken cables', issueType: 'Missing Accessories', suggestedPriority: 'Low' },
            { label: 'Other hardware issue', issueType: 'General Defect', suggestedPriority: 'Medium' }
          ]
        };
      } else {
        equipment = {
          equipmentCode: rawCode,
          name: `Campus Equipment Unit (${rawCode})`,
          category: 'Electrical',
          building: 'Academic Block A',
          floor: '1st Floor',
          roomNumber: 'Room A-102',
          healthScore: 78,
          riskLevel: 'Healthy',
          quickIssues: [
            { label: 'Not turning on', issueType: 'Power Failure', suggestedPriority: 'High' },
            { label: 'Physical damage', issueType: 'Physical Defect', suggestedPriority: 'High' },
            { label: 'Making loud noise', issueType: 'Mechanical Jam', suggestedPriority: 'Medium' },
            { label: 'Other problem', issueType: 'Other', suggestedPriority: 'Medium' }
          ]
        };
      }
    }

    const health = calculateEquipmentHealth(equipment);

    res.json({
      success: true,
      equipment: {
        ...equipment,
        healthScore: health.healthScore,
        riskLevel: health.riskLevel,
        diagnosticReasons: health.reasons,
        aiRecommendation: health.recommendation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit 1-Tap QR Infrastructure Complaint (Zero manual entry)
// @route   POST /api/equipment/quick-report
// @access  Private
const submitQRQuickReport = async (req, res) => {
  try {
    const { equipmentCode, issueLabel, issueType, customNote, priority } = req.body;

    let equipment = await Equipment.findOne({ equipmentCode: equipmentCode?.toUpperCase()?.trim() });
    
    const building = equipment?.building || 'Academic Block C';
    const roomNumber = equipment?.roomNumber || 'Room C-204';
    const category = equipment?.category || 'Classroom';
    const equipmentName = equipment?.name || `Equipment #${equipmentCode}`;

    const ticketId = await generateTicketId();

    const title = `[QR Alert] ${equipmentName}: ${issueLabel || 'Equipment Defect'}`;
    const description = `Reported via 1-Tap QR Scanner.\nEquipment Tag: ${equipmentCode}\nLocation: ${building}, ${roomNumber}\nSpecific Issue: ${issueLabel} (${issueType || 'Defect'})\nAdditional Note: ${customNote || 'No extra remarks'}`;

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category,
      building,
      roomNumber,
      priority: priority || 'High',
      status: 'NEW',
      submittedBy: req.user._id,
      aiDetected: {
        category,
        problem: issueLabel,
        location: `${building} ${roomNumber}`,
        priority: priority || 'High',
        confidence: 0.99
      }
    });

    // Auto calculate smart assignment recommendation
    const assignmentRec = await recommendStaffAssignment(complaint);

    // Initial timeline
    await addTimelineEntry(complaint._id, 'NEW', req.user._id, `QR Quick Report created for ${equipmentCode} (${ticketId})`);

    // Increment repair count on equipment
    if (equipment) {
      equipment.repairCountLast6Months = (equipment.repairCountLast6Months || 0) + 1;
      equipment.healthScore = Math.max(equipment.healthScore - 15, 10);
      await equipment.save();
    }

    res.status(201).json({
      success: true,
      message: `QR Grievance reported successfully! Ticket #${ticketId} dispatched.`,
      ticketId,
      complaint,
      assignmentRecommendation: assignmentRec
    });
  } catch (error) {
    console.error('QR report error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Predictive Maintenance Fleet Dashboard Metrics
// @route   GET /api/equipment/predictive-metrics
// @access  Private (Admin, Team Member, HOD)
const getPredictiveMaintenanceMetrics = async (req, res) => {
  try {
    const all = await Equipment.find();

    let healthyCount = 0;
    let atRiskCount = 0;
    let criticalCount = 0;
    let totalScore = 0;

    const enriched = all.map(item => {
      const health = calculateEquipmentHealth(item);
      totalScore += health.healthScore;
      if (health.riskLevel === 'Healthy') healthyCount++;
      else if (health.riskLevel === 'At Risk') atRiskCount++;
      else criticalCount++;

      return {
        ...item.toObject(),
        healthScore: health.healthScore,
        riskLevel: health.riskLevel,
        diagnosticReasons: health.reasons,
        aiRecommendation: health.recommendation
      };
    });

    const averageFleetScore = all.length > 0 ? Math.round(totalScore / all.length) : 82;

    res.json({
      success: true,
      metrics: {
        totalAssets: all.length,
        averageFleetHealth: averageFleetScore,
        healthyCount,
        atRiskCount,
        criticalCount,
        replacementCandidates: enriched.filter(e => e.riskLevel === 'Critical')
      },
      equipment: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentByQR,
  submitQRQuickReport,
  getPredictiveMaintenanceMetrics
};
