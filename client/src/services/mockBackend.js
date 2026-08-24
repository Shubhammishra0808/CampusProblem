// Comprehensive Standalone Mock Backend & Local Storage DB Engine
// Enables CampusFix to work 100% seamlessly offline, during demo showcases, and on GitHub Pages!

const STORAGE_KEYS = {
  USERS: 'cf_mock_users',
  COMPLAINTS: 'cf_mock_complaints',
  NOTICES: 'cf_mock_notices',
  RESOURCES: 'cf_mock_resources',
  PLACEMENTS: 'cf_mock_placements',
  LOST_FOUND: 'cf_mock_lost_found',
  EQUIPMENT: 'cf_mock_equipment',
  ATTENDANCE: 'cf_mock_attendance',
  CHAT_MESSAGES: 'cf_mock_chat_messages',
  FEEDBACK: 'cf_mock_feedback',
  CURRENT_USER: 'campusfix_user',
  TOKEN: 'campusfix_token'
};

// 1. Initial Mock Users
const INITIAL_USERS = [
  {
    _id: 'user_admin_001',
    name: 'Campus Administrator',
    email: 'admin@campusfix.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM-001',
    designation: 'Dean of Student Welfare & Campus Admin',
    phone: '9876500000',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user_hod_002',
    name: 'Prof. Anjali Verma',
    email: 'hod@campusfix.edu',
    password: 'password123',
    role: 'hod',
    department: 'Computer Science & Engineering',
    employeeId: 'HOD-CSE-101',
    designation: 'Head of Department (CSE)',
    phone: '9876500002',
    officeLocation: 'Block A - HOD Cabin 201',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user_fac_003',
    name: 'Dr. Suresh Kumar',
    email: 'faculty@campusfix.edu',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    employeeId: 'FAC-CSE-108',
    designation: 'Associate Professor',
    phone: '9876500003',
    officeLocation: 'Block A - Room 104',
    consultationHours: 'Mon-Thu 3:00 PM - 5:00 PM',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user_stf_004',
    name: 'Ramesh Electrician',
    email: 'staff@campusfix.edu',
    password: 'password123',
    role: 'staff',
    department: 'Maintenance',
    employeeId: 'MNT-304',
    designation: 'Senior Electrical Technician',
    phone: '9876500004',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user_team_006',
    name: 'Rohan Sharma (Core Lead)',
    email: 'team@campusfix.edu',
    password: 'password123',
    role: 'teammember',
    department: 'Core Operations Committee',
    designation: 'Core Team Lead Coordinator',
    phone: '9876500006',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user_stu_005',
    name: 'Aarav Patel',
    email: 'student@campusfix.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '22CS045',
    phone: '9876500005',
    hostelBlock: 'Boys Hostel 1',
    roomNumber: 'BH-302',
    isApproved: true,
    approvalStatus: 'approved',
    createdAt: new Date().toISOString()
  }
];

// Helper to get / set LocalStorage
const getCollection = (key, defaultData) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultData;
  }
};

const setCollection = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

// 2. Initial Sample Complaints
const INITIAL_COMPLAINTS = [
  {
    _id: 'comp_001',
    ticketId: 'CF-2026-0001-302',
    title: 'Ceiling Fan malfunction in Room C-204',
    description: 'Room C-204 ceiling fan is making loud rattling noise and stopped spinning during afternoon lectures.',
    category: 'Electrical',
    priority: 'High',
    status: 'In Progress',
    building: 'Academic Block C',
    roomNumber: 'C-204',
    user: INITIAL_USERS[5],
    assignedTo: INITIAL_USERS[3],
    upvotes: ['user_stu_005', 'user_fac_003'],
    upvoteCount: 2,
    slaHours: 24,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    timeline: [
      { status: 'Submitted', message: 'Complaint registered by student Aarav Patel', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { status: 'In Progress', message: 'Assigned to Technician Ramesh Electrician', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
    ]
  },
  {
    _id: 'comp_002',
    ticketId: 'CF-2026-0002-108',
    title: 'High-speed Wi-Fi Access Point unreachable in Block A Lab 3',
    description: 'Access point AP-BLK-A3 is dropping packets and students cannot connect to university cloud repository.',
    category: 'Internet/Wi-Fi',
    priority: 'Emergency',
    status: 'Pending',
    building: 'Academic Block A',
    roomNumber: 'Lab 3 (2nd Floor)',
    user: INITIAL_USERS[2],
    assignedTo: null,
    upvotes: ['user_stu_005'],
    upvoteCount: 1,
    slaHours: 4,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    timeline: [
      { status: 'Submitted', message: 'Emergency Wi-Fi outage logged by Dr. Suresh Kumar', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() }
    ]
  },
  {
    _id: 'comp_003',
    ticketId: 'CF-2026-0003-412',
    title: 'Water cooler purifier filter replacement in Boys Hostel 1 (3rd Floor)',
    description: 'Water pressure is low and filter indicator lamp is blinking red.',
    category: 'Water & Plumbing',
    priority: 'Medium',
    status: 'Resolved',
    building: 'Boys Hostel 1',
    roomNumber: '3rd Floor Water Station',
    user: INITIAL_USERS[5],
    assignedTo: INITIAL_USERS[3],
    upvotes: [],
    upvoteCount: 0,
    slaHours: 12,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timeline: [
      { status: 'Submitted', message: 'Ticket raised', timestamp: new Date(Date.now() - 3600000 * 28).toISOString() },
      { status: 'Resolved', message: 'New RO cartridge installed and sanitized.', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  }
];

// 3. Initial Sample Notices
const INITIAL_NOTICES = [
  {
    _id: 'not_001',
    title: '📢 Campus Wi-Fi 6 Upgrade & Scheduled NetOps Maintenance',
    content: 'All Academic Blocks and Hostels will undergo bandwidth enhancement this Saturday between 1:00 AM - 4:00 AM.',
    category: 'Facility',
    priority: 'High',
    targetRole: 'all',
    department: 'Administration',
    author: INITIAL_USERS[0],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'not_002',
    title: '🚀 Microsoft & Google On-Campus Placement Drive 2026',
    content: 'Final and pre-final year engineering students are invited to register on the Placement Portal before Friday.',
    category: 'Placement',
    priority: 'Emergency',
    targetRole: 'student',
    department: 'Computer Science & Engineering',
    author: INITIAL_USERS[1],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// 4. Initial Sample Resources
const INITIAL_RESOURCES = [
  {
    _id: 'res_001',
    title: 'Data Structures & Algorithms - Complete Notes & Solved Problems',
    description: 'Comprehensive lecture slides, time complexity analysis, and practice interview questions.',
    department: 'Computer Science & Engineering',
    semester: 4,
    subject: 'Data Structures & Algorithms',
    category: 'Notes',
    downloads: 142,
    uploadedBy: INITIAL_USERS[2],
    fileUrl: '#',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'res_002',
    title: 'AI & Machine Learning Lab Manual (Python / TensorFlow)',
    description: 'Complete verified lab experiment codes, datasets, and viva guidelines.',
    department: 'Computer Science & Engineering',
    semester: 6,
    subject: 'Machine Learning',
    category: 'Lab Manual',
    downloads: 98,
    uploadedBy: INITIAL_USERS[1],
    fileUrl: '#',
    createdAt: new Date().toISOString()
  }
];

// 5. Initial Sample Placements
const INITIAL_PLACEMENTS = [
  {
    _id: 'plc_001',
    companyName: 'Google Cloud India',
    jobRole: 'Associate Cloud Engineer & SRE',
    packageLPA: 24.5,
    location: 'Bengaluru / Hyderabad / Remote',
    eligibility: 'B.Tech CSE/IT/ECE (CGPA >= 7.5)',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: 'Active',
    rounds: ['Online Assessment (DSA)', 'Technical Interview 1', 'System Design Round', 'HR & Values'],
    applyUrl: 'https://careers.google.com'
  },
  {
    _id: 'plc_002',
    companyName: 'Microsoft R&D',
    jobRole: 'Software Development Engineer I',
    packageLPA: 28.0,
    location: 'Noida / Hyderabad',
    eligibility: 'B.Tech All Branches (CGPA >= 7.0)',
    deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
    status: 'Active',
    rounds: ['Coding Round (LeetCode)', 'Data Structures Deep Dive', 'Behavioral Interview'],
    applyUrl: 'https://careers.microsoft.com'
  }
];

// 6. Initial Sample Lost & Found
const INITIAL_LOST_FOUND = [
  {
    _id: 'lf_001',
    type: 'found',
    itemName: 'HP Blue Wireless Mouse with USB Dongle',
    category: 'Electronics',
    location: 'Academic Block A - Smart Lab 202',
    description: 'Found on desk row 3 after CSE 4th sem practical exam.',
    status: 'Open',
    postedBy: INITIAL_USERS[5],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'lf_002',
    type: 'lost',
    itemName: 'Scientific Calculator Casio fx-991EX',
    category: 'Study Material',
    location: 'Central Library 1st Floor Study Cubicle',
    description: 'Black body with white keys, has a small sticker on the back lid.',
    status: 'Open',
    postedBy: INITIAL_USERS[5],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

// 7. Initial Equipment
const INITIAL_EQUIPMENT = [
  {
    _id: 'eq_001',
    qrCode: 'EQ-BLK-A-101',
    name: 'Epson 4K Laser Classroom Projector',
    equipmentType: 'Projector',
    building: 'Academic Block A',
    roomNumber: 'Room 101',
    status: 'Operational',
    healthScore: 94,
    vibrationLevel: '0.12 g',
    operatingTemp: '38 °C',
    lastServiced: '2026-02-01'
  },
  {
    _id: 'eq_002',
    qrCode: 'EQ-SCI-LAB-04',
    name: 'Schneider 3-Phase Laboratory Air Conditioner 2.5 Ton',
    equipmentType: 'HVAC/AC',
    building: 'Science Block & Labs',
    roomNumber: 'AI Computing Lab 4',
    status: 'Needs Maintenance',
    healthScore: 68,
    vibrationLevel: '0.45 g',
    operatingTemp: '47 °C',
    lastServiced: '2025-11-15'
  }
];

// 8. Initial Attendance Data
const INITIAL_ATTENDANCE = {
  policy: {
    minPercentageRequired: 75,
    lateGraceMinutes: 15,
    autoAbsentAfterMinutes: 30,
    enableGeoFencing: true,
    maxDistanceMeters: 100
  },
  sessions: [
    {
      _id: 'att_sess_001',
      subjectName: 'Design and Analysis of Algorithms',
      subjectCode: 'CS-401',
      facultyName: 'Dr. Suresh Kumar',
      room: 'Lecture Hall 104',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      status: 'active',
      passcode: '4589',
      attendanceCount: 42,
      totalStudents: 48
    }
  ],
  studentSummary: {
    overallPercentage: 84.5,
    totalClasses: 120,
    attendedClasses: 101,
    absentClasses: 19,
    safeBunksAvailable: 4,
    status: 'Eligible (Safe Zone)',
    subjectWise: [
      { code: 'CS-401', name: 'Design and Analysis of Algorithms', attended: 26, total: 30, percentage: 86.6 },
      { code: 'CS-402', name: 'Database Management Systems', attended: 24, total: 28, percentage: 85.7 },
      { code: 'CS-403', name: 'Operating Systems & Concurrency', attended: 25, total: 32, percentage: 78.1 },
      { code: 'CS-404', name: 'Computer Networks & Security', attended: 26, total: 30, percentage: 86.6 }
    ]
  }
};

// 9. Initial Chat Messages
const INITIAL_CHAT_MESSAGES = [
  {
    _id: 'msg_001',
    sender: 'AI Campus Assistant',
    senderRole: 'admin',
    text: 'Welcome to CampusFix Smart Chat! You can ask questions about exam schedules, report problems, check library seats, or talk to faculty.',
    timestamp: new Date().toISOString(),
    isAI: true
  }
];

// Helper to simulate network latency for a realistic feel
const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

// ================= THE MOCK BACKEND CONTROLLER =================
export const handleMockRequest = async (method, url, data = null, headers = {}) => {
  await delay(120);

  const cleanUrl = url.replace(/^\/api/, '');
  const users = getCollection(STORAGE_KEYS.USERS, INITIAL_USERS);
  const complaints = getCollection(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  const notices = getCollection(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  const resources = getCollection(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  const placements = getCollection(STORAGE_KEYS.PLACEMENTS, INITIAL_PLACEMENTS);
  const lostFound = getCollection(STORAGE_KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
  const equipment = getCollection(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  const attendance = getCollection(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  const chatMessages = getCollection(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES);
  const feedbackList = getCollection(STORAGE_KEYS.FEEDBACK, []);

  // --- 1. AUTH ROUTES ---
  if (cleanUrl.startsWith('/auth/login')) {
    const { email, password } = data || {};
    const normEmail = (email || '').trim().toLowerCase();
    
    // Look in current users or fallback to INITIAL_USERS
    let foundUser = users.find(u => u.email.toLowerCase() === normEmail);
    if (!foundUser) {
      foundUser = INITIAL_USERS.find(u => u.email.toLowerCase() === normEmail);
      if (foundUser) {
        users.push(foundUser);
        setCollection(STORAGE_KEYS.USERS, users);
      }
    }

    // Admin email matching
    if (normEmail === 'admin@campusfix.edu' || normEmail === 'admin' || normEmail.startsWith('admin@')) {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      const token = `mock_jwt_token_admin_${Date.now()}`;
      return {
        data: {
          success: true,
          token,
          user: adminUser,
          message: 'Admin Sign in successful'
        }
      };
    }

    // If user is found, allow login
    if (foundUser) {
      const token = `mock_jwt_token_${foundUser._id}_${Date.now()}`;
      return {
        data: {
          success: true,
          token,
          user: foundUser,
          message: 'Sign in successful'
        }
      };
    }

    // Role-based fallback matching
    const fallbackUser = INITIAL_USERS.find(u => normEmail.includes(u.role)) || INITIAL_USERS[5];
    const token = `mock_jwt_token_${fallbackUser._id}_${Date.now()}`;
    return {
      data: {
        success: true,
        token,
        user: fallbackUser,
        message: `Welcome back, ${fallbackUser.name}!`
      }
    };
  }

  if (cleanUrl.startsWith('/auth/send-otp')) {
    const { phone, role } = data || {};
    const generatedOtp = '123456';
    return {
      data: {
        success: true,
        phone,
        otp: generatedOtp,
        message: `OTP sent successfully to +91-${phone}`
      }
    };
  }

  if (cleanUrl.startsWith('/auth/verify-otp')) {
    const { phone, otp, role } = data || {};
    let matchedUser = users.find(u => u.phone === phone || u.role === role);
    if (!matchedUser) {
      matchedUser = users.find(u => u.role === role) || users[5];
    }
    const token = `mock_jwt_token_${matchedUser._id}_${Date.now()}`;
    return {
      data: {
        success: true,
        token,
        user: matchedUser,
        message: 'OTP verified successfully'
      }
    };
  }

  if (cleanUrl.startsWith('/auth/register')) {
    const newUser = {
      _id: `user_${Date.now()}`,
      name: data.name || 'Campus Member',
      email: data.email,
      password: data.password || 'password123',
      role: data.role || 'student',
      department: data.department || 'Computer Science & Engineering',
      rollNumber: data.rollNumber || '22CS999',
      phone: data.phone || '9876543210',
      isApproved: true,
      approvalStatus: 'approved',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setCollection(STORAGE_KEYS.USERS, users);
    return {
      data: {
        success: true,
        token: `mock_jwt_token_${newUser._id}`,
        user: newUser,
        message: 'Account created successfully!'
      }
    };
  }

  if (cleanUrl.startsWith('/auth/me')) {
    const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[0];
    return {
      data: {
        success: true,
        user: savedUser
      }
    };
  }

  if (cleanUrl.startsWith('/auth/profile')) {
    const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[0];
    const updated = { ...savedUser, ...(data || {}) };
    setCollection(STORAGE_KEYS.CURRENT_USER, updated);
    return {
      data: {
        success: true,
        user: updated,
        message: 'Profile updated successfully'
      }
    };
  }

  // --- 1.1 NOTIFICATIONS ---
  if (cleanUrl.startsWith('/notifications')) {
    return {
      data: {
        success: true,
        unreadCount: 2,
        notifications: [
          { _id: 'notif_1', title: 'Ticket Status Update', message: 'Complaint CF-2026-0001 assigned to Ramesh Technician.', isRead: false, createdAt: new Date().toISOString() },
          { _id: 'notif_2', title: 'Campus Alert', message: 'Scheduled generator maintenance in Block B today at 4:00 PM.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { _id: 'notif_3', title: 'Attendance Verified', message: '75% safe criteria verified for Computer Networks.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]
      }
    };
  }

  // --- 1.2 ADMIN & DASHBOARD STATS ---
  if (cleanUrl.startsWith('/admin/dashboard-stats')) {
    return {
      data: {
        success: true,
        stats: {
          totalStudents: 1240,
          totalComplaints: complaints.length || 24,
          pendingComplaints: complaints.filter(c => c.status === 'Pending').length || 4,
          resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length || 18,
          emergencyComplaints: complaints.filter(c => c.priority === 'Emergency').length || 1,
          resolutionRate: 94.8,
          avgResolutionHours: 1.8,
          mostProblematicBuilding: 'Academic Block C (Labs)',
          mostCommonCategory: 'Electrical & Internet'
        },
        charts: {
          byCategory: [
            { name: 'Electrical', count: 8 },
            { name: 'Water/Plumb', count: 5 },
            { name: 'Internet/Wi-Fi', count: 7 },
            { name: 'Classroom', count: 3 },
            { name: 'Hostel', count: 4 }
          ],
          monthlyTrend: [
            { name: 'Sep', Complaints: 12, Resolved: 10 },
            { name: 'Oct', Complaints: 18, Resolved: 16 },
            { name: 'Nov', Complaints: 14, Resolved: 13 },
            { name: 'Dec', Complaints: 22, Resolved: 21 },
            { name: 'Jan', Complaints: 19, Resolved: 19 },
            { name: 'Feb', Complaints: 15, Resolved: 14 }
          ]
        }
      }
    };
  }

  if (cleanUrl.startsWith('/admin/campus-heatmap')) {
    return {
      data: {
        success: true,
        heatmap: [
          { _id: 'bld_1', code: 'BLK-A', name: 'Academic Block A', category: 'Academic', floors: 4, inChargeName: 'Prof. Sharma', contactPhone: '9876543201', severity: 'Green', activeComplaints: 1, emergencyComplaints: 0 },
          { _id: 'bld_2', code: 'BLK-B', name: 'Academic Block B', category: 'Academic', floors: 4, inChargeName: 'Dr. Ramesh', contactPhone: '9876543202', severity: 'Yellow', activeComplaints: 3, emergencyComplaints: 0 },
          { _id: 'bld_3', code: 'BLK-C', name: 'Academic Block C (Labs)', category: 'Laboratories', floors: 3, inChargeName: 'Prof. Verma', contactPhone: '9876543203', severity: 'Red', activeComplaints: 5, emergencyComplaints: 1 },
          { _id: 'bld_4', code: 'HST-1', name: 'Boys Hostel 1', category: 'Residential', floors: 5, inChargeName: 'Warden Gupta', contactPhone: '9876543204', severity: 'Yellow', activeComplaints: 2, emergencyComplaints: 0 },
          { _id: 'bld_5', code: 'HST-2', name: 'Girls Hostel 1', category: 'Residential', floors: 5, inChargeName: 'Warden Sharma', contactPhone: '9876543205', severity: 'Green', activeComplaints: 0, emergencyComplaints: 0 },
          { _id: 'bld_6', code: 'LIB-1', name: 'Central Library', category: 'Facilities', floors: 3, inChargeName: 'Chief Librarian Patel', contactPhone: '9876543206', severity: 'Green', activeComplaints: 1, emergencyComplaints: 0 },
          { _id: 'bld_7', code: 'CAF-1', name: 'Student Cafeteria & Mess', category: 'Amenities', floors: 2, inChargeName: 'Mess Manager Rao', contactPhone: '9876543207', severity: 'Green', activeComplaints: 0, emergencyComplaints: 0 },
          { _id: 'bld_8', code: 'SPT-1', name: 'Sports Complex & Gym', category: 'Athletics', floors: 2, inChargeName: 'Coach Singh', contactPhone: '9876543208', severity: 'Green', activeComplaints: 0, emergencyComplaints: 0 }
        ]
      }
    };
  }

  if (cleanUrl.startsWith('/admin/users')) {
    return {
      data: {
        success: true,
        users: users
      }
    };
  }

  if (cleanUrl.startsWith('/admin/complaints')) {
    return {
      data: {
        success: true,
        count: complaints.length,
        complaints: complaints
      }
    };
  }

  // --- 1.3 FACULTY & STAFF ROUTES ---
  if (cleanUrl.startsWith('/faculty/attendance/quick-code')) {
    return { data: { success: true, code: '4589' } };
  }

  if (cleanUrl.startsWith('/faculty/stats')) {
    return {
      data: {
        success: true,
        stats: {
          assignedComplaints: 4,
          resolvedComplaints: 18,
          activeLectures: 3,
          totalStudents: 180
        }
      }
    };
  }

  if (cleanUrl.startsWith('/staff/stats')) {
    return {
      data: {
        success: true,
        stats: {
          assignedComplaints: 5,
          completedToday: 3,
          pendingSpares: 1
        }
      }
    };
  }

  // --- 2. COMPLAINT ROUTES ---
  if (cleanUrl.startsWith('/complaints/track/')) {
    const ticketId = cleanUrl.split('/track/')[1];
    const item = complaints.find(c => c.ticketId.toLowerCase() === ticketId.toLowerCase() || c._id === ticketId);
    if (item) {
      return { data: { success: true, complaint: item } };
    }
    const err = new Error('Complaint ticket not found');
    err.response = { status: 404, data: { success: false, message: 'Complaint ticket not found' } };
    throw err;
  }

  if (cleanUrl.startsWith('/complaints') && method === 'GET') {
    return {
      data: {
        success: true,
        count: complaints.length,
        complaints: complaints
      }
    };
  }

  if (cleanUrl.startsWith('/complaints') && method === 'POST') {
    const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[5];
    const ticketNum = Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      _id: `comp_${Date.now()}`,
      ticketId: `CF-2026-${ticketNum}-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title || 'Reported Problem',
      description: data.description || '',
      category: data.category || 'General Infrastructure',
      priority: data.priority || 'Medium',
      status: 'Pending',
      building: data.building || 'Academic Block A',
      roomNumber: data.roomNumber || 'Room 101',
      user: savedUser,
      assignedTo: null,
      upvotes: [],
      upvoteCount: 0,
      slaHours: data.priority === 'Emergency' ? 2 : data.priority === 'High' ? 12 : 24,
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'Submitted', message: 'Ticket registered into CampusFix Dispatch Grid', timestamp: new Date().toISOString() }
      ]
    };
    complaints.unshift(newComplaint);
    setCollection(STORAGE_KEYS.COMPLAINTS, complaints);
    return {
      data: {
        success: true,
        complaint: newComplaint,
        message: 'Complaint submitted successfully!'
      }
    };
  }

  if (cleanUrl.includes('/upvote')) {
    const id = cleanUrl.split('/')[2];
    const comp = complaints.find(c => c._id === id);
    if (comp) {
      comp.upvoteCount = (comp.upvoteCount || 0) + 1;
      setCollection(STORAGE_KEYS.COMPLAINTS, complaints);
      return { data: { success: true, complaint: comp, message: 'Upvoted!' } };
    }
  }

  if (cleanUrl.includes('/status') || cleanUrl.includes('/assign')) {
    const parts = cleanUrl.split('/');
    const id = parts[2];
    const comp = complaints.find(c => c._id === id);
    if (comp) {
      if (data.status) comp.status = data.status;
      if (data.assignedTo) comp.assignedTo = users.find(u => u._id === data.assignedTo) || comp.assignedTo;
      comp.timeline.push({
        status: comp.status,
        message: data.remarks || `Status updated to ${comp.status}`,
        timestamp: new Date().toISOString()
      });
      setCollection(STORAGE_KEYS.COMPLAINTS, complaints);
      return { data: { success: true, complaint: comp } };
    }
  }

  // --- 3. NOTICES ROUTES ---
  if (cleanUrl.startsWith('/notices')) {
    if (method === 'GET') {
      return { data: { success: true, notices } };
    }
    if (method === 'POST') {
      const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[0];
      const newNotice = {
        _id: `not_${Date.now()}`,
        title: data.title,
        content: data.content,
        category: data.category || 'General',
        priority: data.priority || 'Medium',
        targetRole: data.targetRole || 'all',
        department: data.department || 'Administration',
        author: savedUser,
        createdAt: new Date().toISOString()
      };
      notices.unshift(newNotice);
      setCollection(STORAGE_KEYS.NOTICES, notices);
      return { data: { success: true, notice: newNotice } };
    }
  }

  // --- 4. RESOURCE HUB ROUTES ---
  if (cleanUrl.startsWith('/resources')) {
    if (method === 'GET') {
      return { data: { success: true, resources } };
    }
    if (method === 'POST') {
      const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[2];
      const newRes = {
        _id: `res_${Date.now()}`,
        title: data.title,
        description: data.description,
        department: data.department || 'Computer Science & Engineering',
        semester: data.semester || 4,
        subject: data.subject || 'Engineering Subject',
        category: data.category || 'Notes',
        downloads: 0,
        uploadedBy: savedUser,
        fileUrl: '#',
        createdAt: new Date().toISOString()
      };
      resources.unshift(newRes);
      setCollection(STORAGE_KEYS.RESOURCES, resources);
      return { data: { success: true, resource: newRes } };
    }
  }

  // --- 5. PLACEMENTS ROUTES ---
  if (cleanUrl.startsWith('/placements')) {
    if (method === 'GET') {
      return { data: { success: true, placements } };
    }
    if (method === 'POST') {
      const newPlc = { ...data, _id: `plc_${Date.now()}`, createdAt: new Date().toISOString() };
      placements.unshift(newPlc);
      setCollection(STORAGE_KEYS.PLACEMENTS, placements);
      return { data: { success: true, placement: newPlc } };
    }
  }

  // --- 6. LOST & FOUND ROUTES ---
  if (cleanUrl.startsWith('/lost-found')) {
    if (method === 'GET') {
      return { data: { success: true, items: lostFound } };
    }
    if (method === 'POST') {
      const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null') || users[5];
      const newLF = {
        _id: `lf_${Date.now()}`,
        type: data.type || 'found',
        itemName: data.itemName || 'Campus Item',
        category: data.category || 'General',
        location: data.location || 'Campus Ground',
        description: data.description || '',
        status: 'Open',
        postedBy: savedUser,
        createdAt: new Date().toISOString()
      };
      lostFound.unshift(newLF);
      setCollection(STORAGE_KEYS.LOST_FOUND, lostFound);
      return { data: { success: true, item: newLF } };
    }
  }

  // --- 7. ATTENDANCE ROUTES ---
  if (cleanUrl.startsWith('/attendance/student-summary') || cleanUrl.startsWith('/attendance/my')) {
    return { data: { success: true, summary: attendance.studentSummary, sessions: attendance.sessions } };
  }

  if (cleanUrl.startsWith('/attendance/policy')) {
    return { data: { success: true, policy: attendance.policy } };
  }

  if (cleanUrl.startsWith('/attendance/sessions') || cleanUrl.startsWith('/attendance/active')) {
    return { data: { success: true, sessions: attendance.sessions } };
  }

  if (cleanUrl.startsWith('/attendance/mark')) {
    return {
      data: {
        success: true,
        message: '🎉 Attendance marked successfully! Verified via RFID & Geofence GPS.',
        status: 'Present',
        timestamp: new Date().toISOString()
      }
    };
  }

  // --- 8. EQUIPMENT & PREDICTIVE METRICS ---
  if (cleanUrl.startsWith('/equipment/predictive-metrics') || cleanUrl.startsWith('/equipment/metrics')) {
    return {
      data: {
        success: true,
        equipmentList: equipment,
        summary: {
          totalMonitored: 48,
          healthyCount: 42,
          warningCount: 4,
          criticalCount: 2,
          overallFleetHealth: 92.4
        }
      }
    };
  }

  if (cleanUrl.startsWith('/equipment/qr/')) {
    const code = cleanUrl.split('/qr/')[1];
    const eq = equipment.find(e => e.qrCode.toLowerCase() === code.toLowerCase()) || equipment[0];
    return { data: { success: true, equipment: eq } };
  }

  if (cleanUrl.startsWith('/equipment/quick-report')) {
    const newComp = {
      _id: `comp_${Date.now()}`,
      ticketId: `CF-QR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.issueTitle || 'QR Equipment Issue',
      description: data.description || 'Reported via 1-Tap QR scan',
      category: 'Equipment/Hardware',
      priority: data.urgency || 'High',
      status: 'Pending',
      building: data.building || 'Academic Block A',
      roomNumber: data.roomNumber || 'Smart Lab',
      user: users[5],
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'Submitted', message: 'Logged via Quick QR Scanner', timestamp: new Date().toISOString() }]
    };
    complaints.unshift(newComp);
    setCollection(STORAGE_KEYS.COMPLAINTS, complaints);
    return { data: { success: true, complaint: newComp, message: 'QR Issue Reported Successfully!' } };
  }

  // --- 9. ADMIN METRICS & USER MANAGEMENT ---
  if (cleanUrl.startsWith('/admin/dashboard-stats') || cleanUrl.startsWith('/admin/stats')) {
    return {
      data: {
        success: true,
        stats: {
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
          inProgressComplaints: complaints.filter(c => c.status === 'In Progress').length,
          resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
          totalUsers: users.length,
          resolutionRate: '94.8%',
          avgResolutionHours: '3.8'
        }
      }
    };
  }

  if (cleanUrl.startsWith('/admin/users')) {
    return { data: { success: true, users } };
  }

  // --- 10. CHAT SYSTEM ---
  if (cleanUrl.startsWith('/chat/contacts')) {
    return {
      data: {
        success: true,
        contacts: [
          { _id: 'c_ai', name: '🤖 CampusFix AI Copilot', role: 'ai', status: 'online' },
          { _id: 'c_dean', name: '👑 Dean & Campus Administration', role: 'admin', status: 'online' },
          { _id: 'c_hod', name: 'Prof. Anjali Verma (HOD CSE)', role: 'hod', status: 'online' },
          { _id: 'c_staff', name: 'Ramesh Electrician (Maintenance)', role: 'staff', status: 'online' },
          { _id: 'c_team', name: 'Core Operations Team Lead', role: 'teammember', status: 'online' }
        ]
      }
    };
  }

  if (cleanUrl.startsWith('/chat/send')) {
    const userMsg = {
      _id: `msg_${Date.now()}`,
      sender: data.sender || 'You',
      text: data.text || '',
      timestamp: new Date().toISOString()
    };
    chatMessages.push(userMsg);

    // AI bot automatic intelligent reply
    let replyText = `Thanks for contacting Campus Support! Your message has been routed to the respective desk.`;
    const q = (data.text || '').toLowerCase();
    if (q.includes('wifi') || q.includes('internet')) {
      replyText = '📡 Wi-Fi NetOps Alert: Router AP-BLK-A3 is currently being reset. Bandwidth will normalize in ~10 mins.';
    } else if (q.includes('attendance') || q.includes('75%')) {
      replyText = '📊 Attendance Portal: Minimum criteria is 75%. Your current eligibility is in the Safe Zone.';
    } else if (q.includes('exam') || q.includes('notice')) {
      replyText = '📅 Academic Notice: Mid-Semester exams commence on March 15th. Syllabus uploaded in Resource Hub.';
    }

    const aiMsg = {
      _id: `msg_${Date.now() + 1}`,
      sender: '🤖 CampusFix AI Copilot',
      text: replyText,
      timestamp: new Date(Date.now() + 500).toISOString(),
      isAI: true
    };
    chatMessages.push(aiMsg);
    setCollection(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);

    return { data: { success: true, message: userMsg, reply: aiMsg } };
  }

  if (cleanUrl.startsWith('/chat')) {
    return { data: { success: true, messages: chatMessages } };
  }

  // --- 11. FEEDBACK ---
  if (cleanUrl.startsWith('/feedback') && method === 'POST') {
    feedbackList.push({ ...data, id: `fb_${Date.now()}`, date: new Date().toISOString() });
    setCollection(STORAGE_KEYS.FEEDBACK, feedbackList);
    return { data: { success: true, message: 'Feedback submitted successfully! Thank you for rating campus facilities.' } };
  }

  // --- 12. FULL ATTENDANCE SYSTEM ENGINE (STUDENT, FACULTY, HOD, ADMIN) ---
  const mockSubjects = [
    { _id: 'sub_cs501', code: 'CS501', name: 'Operating Systems & System Architecture', department: 'Computer Science & Engineering', semester: 5, credits: 4, faculty: { _id: 'user_fac_003', name: 'Dr. Suresh Kumar', email: 'faculty@campusfix.edu' }, totalPlannedClasses: 45, attendedClasses: 38, conductedClasses: 42 },
    { _id: 'sub_cs502', code: 'CS502', name: 'Database Management Systems & SQL Analytics', department: 'Computer Science & Engineering', semester: 5, credits: 4, faculty: { _id: 'user_hod_002', name: 'Prof. Anjali Verma', email: 'hod@campusfix.edu' }, totalPlannedClasses: 45, attendedClasses: 35, conductedClasses: 40 },
    { _id: 'sub_cs503', code: 'CS503', name: 'Computer Networks & Security Protocols', department: 'Computer Science & Engineering', semester: 5, credits: 3, faculty: { _id: 'user_fac_003', name: 'Dr. Suresh Kumar', email: 'faculty@campusfix.edu' }, totalPlannedClasses: 40, attendedClasses: 28, conductedClasses: 34 },
    { _id: 'sub_cs504', code: 'CS504', name: 'Artificial Intelligence & Machine Learning', department: 'Computer Science & Engineering', semester: 5, credits: 4, faculty: { _id: 'user_hod_002', name: 'Prof. Anjali Verma', email: 'hod@campusfix.edu' }, totalPlannedClasses: 45, attendedClasses: 39, conductedClasses: 44 },
    { _id: 'sub_cs505', code: 'CS505', name: 'Cloud Computing, DevOps & Microservices', department: 'Computer Science & Engineering', semester: 5, credits: 3, faculty: { _id: 'user_fac_003', name: 'Dr. Suresh Kumar', email: 'faculty@campusfix.edu' }, totalPlannedClasses: 36, attendedClasses: 31, conductedClasses: 35 }
  ];

  if (cleanUrl.startsWith('/attendance/policy')) {
    if (method === 'PUT') {
      return { data: { success: true, message: 'Policy updated successfully', policy: { ...data, minAttendancePercent: data.minAttendancePercent || 75 } } };
    }
    return {
      data: {
        success: true,
        policy: {
          institutionName: 'CampusFix Engineering University',
          minAttendancePercent: 75,
          warningThresholdPercent: 80,
          criticalThresholdPercent: 75,
          lockDurationHours: 24,
          qrSessionDurationMinutes: 5,
          locationVerificationEnabled: false,
          calculationRules: { presentWeight: 1, lateWeight: 0.5, onDutyCountsAsPresent: true, excusedExcludedFromTotal: true }
        }
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/subjects')) {
    if (method === 'POST') {
      const newSub = {
        _id: `sub_${Date.now()}`,
        code: data.code || 'CS599',
        name: data.name || 'Special Elective',
        department: data.department || 'Computer Science & Engineering',
        semester: Number(data.semester) || 5,
        credits: Number(data.credits) || 3,
        faculty: users.find(u => u._id === data.facultyId) || users[2],
        totalPlannedClasses: Number(data.totalPlannedClasses) || 40,
        conductedClasses: 0,
        attendedClasses: 0
      };
      return { data: { success: true, message: 'Subject created successfully', subject: newSub } };
    }
    return { data: { success: true, subjects: mockSubjects } };
  }

  if (cleanUrl.startsWith('/attendance/student-summary')) {
    const totalConducted = mockSubjects.reduce((sum, s) => sum + s.conductedClasses, 0);
    const totalAttended = mockSubjects.reduce((sum, s) => sum + s.attendedClasses, 0);
    const overallPercentage = Number(((totalAttended / totalConducted) * 100).toFixed(1));

    const subjectBreakdown = mockSubjects.map(s => {
      const pct = Number(((s.attendedClasses / s.conductedClasses) * 100).toFixed(1));
      const required75 = Math.ceil(0.75 * s.conductedClasses);
      const safeBunks = Math.max(0, Math.floor((s.attendedClasses - 0.75 * s.conductedClasses) / 0.75));
      const neededClasses = pct < 75 ? Math.ceil((0.75 * s.conductedClasses - s.attendedClasses) / 0.25) : 0;
      
      let status = 'Safe Zone';
      if (pct < 75) status = 'Critical Shortage';
      else if (pct < 80) status = 'Warning Zone';

      return {
        subjectId: s._id,
        code: s.code,
        name: s.name,
        facultyName: s.faculty?.name || 'Assigned Faculty',
        credits: s.credits,
        conducted: s.conductedClasses,
        attended: s.attendedClasses,
        missed: s.conductedClasses - s.attendedClasses,
        percentage: pct,
        status,
        safeBunks,
        neededClasses
      };
    });

    return {
      data: {
        success: true,
        summary: {
          studentName: 'Aarav Patel',
          rollNumber: '22CS045',
          department: 'Computer Science & Engineering',
          semester: 5,
          overallPercentage,
          totalConducted,
          totalAttended,
          totalMissed: totalConducted - totalAttended,
          status: overallPercentage >= 75 ? 'Safe Zone' : 'Critical Shortage',
          safeBunksAvailable: 8,
          subjectBreakdown,
          recentActivity: [
            { id: 'rec_1', date: new Date().toISOString(), subjectCode: 'CS501', subjectName: 'Operating Systems', status: 'Present', slot: '09:00 AM - 10:00 AM', room: 'Room C-201' },
            { id: 'rec_2', date: new Date(Date.now() - 86400000).toISOString(), subjectCode: 'CS502', subjectName: 'Database Management Systems', status: 'Present', slot: '10:00 AM - 11:00 AM', room: 'Room C-201' },
            { id: 'rec_3', date: new Date(Date.now() - 86400000 * 2).toISOString(), subjectCode: 'CS504', subjectName: 'Artificial Intelligence', status: 'Present', slot: '11:15 AM - 12:15 PM', room: 'Lab 3' },
            { id: 'rec_4', date: new Date(Date.now() - 86400000 * 3).toISOString(), subjectCode: 'CS503', subjectName: 'Computer Networks', status: 'Absent', slot: '02:00 PM - 03:00 PM', room: 'Room C-204' }
          ]
        }
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/faculty/schedule')) {
    return {
      data: {
        success: true,
        schedule: [
          { id: 'slot-1', lectureSlot: '09:00 AM - 10:00 AM', roomNumber: 'Room C-201', section: 'A', subject: mockSubjects[0], marked: true, totalStudents: 60, presentCount: 54 },
          { id: 'slot-2', lectureSlot: '10:00 AM - 11:00 AM', roomNumber: 'Room C-201', section: 'A', subject: mockSubjects[1], marked: false, totalStudents: 60, presentCount: 0 },
          { id: 'slot-3', lectureSlot: '11:15 AM - 12:15 PM', roomNumber: 'Lab 3 (AI Studio)', section: 'B', subject: mockSubjects[3], marked: false, totalStudents: 58, presentCount: 0 },
          { id: 'slot-4', lectureSlot: '02:00 PM - 03:00 PM', roomNumber: 'Room C-204', section: 'B', subject: mockSubjects[4], marked: false, totalStudents: 55, presentCount: 0 }
        ]
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/class-students')) {
    const sampleRoster = [
      { _id: 'stu_1', name: 'Aarav Patel', rollNumber: '22CS045', email: 'student@campusfix.edu', attendancePct: 88.5, status: 'Present' },
      { _id: 'stu_2', name: 'Ananya Sharma', rollNumber: '22CS046', email: 'ananya@campusfix.edu', attendancePct: 94.2, status: 'Present' },
      { _id: 'stu_3', name: 'Bhavin Shah', rollNumber: '22CS047', email: 'bhavin@campusfix.edu', attendancePct: 71.4, status: 'Absent' },
      { _id: 'stu_4', name: 'Chetan Joshi', rollNumber: '22CS048', email: 'chetan@campusfix.edu', attendancePct: 78.0, status: 'Present' },
      { _id: 'stu_5', name: 'Deepika Iyer', rollNumber: '22CS049', email: 'deepika@campusfix.edu', attendancePct: 91.0, status: 'Present' },
      { _id: 'stu_6', name: 'Farhan Ali', rollNumber: '22CS050', email: 'farhan@campusfix.edu', attendancePct: 68.5, status: 'Absent' }
    ];
    return { data: { success: true, students: sampleRoster } };
  }

  if (cleanUrl.startsWith('/attendance/mark')) {
    return {
      data: {
        success: true,
        message: 'Attendance for 60 students saved and verified with immutable tamper-resistant audit hash.',
        markedCount: 60,
        sessionId: `sess_${Date.now()}`
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/qr/start')) {
    const token = `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return {
      data: {
        success: true,
        sessionId: `qrsess_${Date.now()}`,
        qrToken: token,
        qrPayload: `campusfix://attendance/verify?token=${token}&ts=${Date.now()}`,
        durationMinutes: data?.durationMinutes || 5,
        expiresAt: new Date(Date.now() + (data?.durationMinutes || 5) * 60000).toISOString()
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/qr/verify')) {
    return {
      data: {
        success: true,
        message: 'Attendance Verified! Geofence within 50m radius verified. Your status is now marked Present.',
        verificationTime: new Date().toISOString(),
        subjectName: 'Operating Systems (CS501)',
        updatedPercentage: '84.2%'
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/qr/end')) {
    return { data: { success: true, message: 'QR Attendance Session concluded. All submitted tokens locked.' } };
  }

  if (cleanUrl.startsWith('/attendance/analytics')) {
    return {
      data: {
        success: true,
        analytics: {
          department: 'Computer Science & Engineering',
          totalStudents: 240,
          avgDepartmentAttendance: 82.4,
          safeZoneCount: 198,
          warningZoneCount: 28,
          criticalDefaulterCount: 14,
          attendanceDistribution: [
            { range: '90-100%', count: 110, percentage: 45.8 },
            { range: '80-89%', count: 88, percentage: 36.6 },
            { range: '75-79%', count: 28, percentage: 11.7 },
            { range: '<75% (Defaulter)', count: 14, percentage: 5.8 }
          ],
          subjectAverages: [
            { subject: 'CS501 OS', avg: 85.2 },
            { subject: 'CS502 DBMS', avg: 82.1 },
            { subject: 'CS503 Networks', avg: 77.4 },
            { subject: 'CS504 AI/ML', avg: 88.6 },
            { subject: 'CS505 Cloud', avg: 81.3 }
          ],
          defaulters: [
            { rollNumber: '22CS047', name: 'Bhavin Shah', attendance: 71.4, shortfallClasses: 4, parentPhone: '9876543210' },
            { rollNumber: '22CS050', name: 'Farhan Ali', attendance: 68.5, shortfallClasses: 6, parentPhone: '9876543211' },
            { rollNumber: '22CS012', name: 'Divya Rawat', attendance: 73.1, shortfallClasses: 2, parentPhone: '9876543212' }
          ]
        }
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/history') || cleanUrl.startsWith('/attendance/calendar')) {
    const historyList = [
      { _id: 'h_1', date: new Date().toISOString(), subject: mockSubjects[0], status: 'Present', markedBy: 'Dr. Suresh Kumar', verificationMethod: 'QR Scan' },
      { _id: 'h_2', date: new Date(Date.now() - 86400000).toISOString(), subject: mockSubjects[1], status: 'Present', markedBy: 'Prof. Anjali Verma', verificationMethod: 'Manual Roster' },
      { _id: 'h_3', date: new Date(Date.now() - 86400000 * 2).toISOString(), subject: mockSubjects[3], status: 'Present', markedBy: 'Prof. Anjali Verma', verificationMethod: 'QR Scan' },
      { _id: 'h_4', date: new Date(Date.now() - 86400000 * 3).toISOString(), subject: mockSubjects[2], status: 'Absent', markedBy: 'Dr. Suresh Kumar', verificationMethod: 'Manual Roster' },
      { _id: 'h_5', date: new Date(Date.now() - 86400000 * 4).toISOString(), subject: mockSubjects[4], status: 'Present', markedBy: 'Dr. Suresh Kumar', verificationMethod: 'QR Scan' }
    ];
    return { data: { success: true, history: historyList, records: historyList } };
  }

  if (cleanUrl.startsWith('/attendance/reports')) {
    return {
      data: {
        success: true,
        report: {
          generatedAt: new Date().toISOString(),
          department: 'Computer Science & Engineering',
          semester: 5,
          totalStudents: 240,
          classesConducted: 195,
          overallAverage: 82.4,
          downloadUrl: '#',
          fileName: 'CSE_Sem5_Official_Attendance_Report_2026.pdf'
        }
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/audit-logs')) {
    return {
      data: {
        success: true,
        logs: [
          { id: 'log_1', action: 'ATTENDANCE_MARKED', subject: 'CS501', performedByName: 'Dr. Suresh Kumar', role: 'faculty', timestamp: new Date().toISOString(), details: 'Marked 60 students via Web Terminal' },
          { id: 'log_2', action: 'QR_SESSION_COMPLETED', subject: 'CS504', performedByName: 'Prof. Anjali Verma', role: 'hod', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Dynamic QR check-in verified 58 students' },
          { id: 'log_3', action: 'RECORD_EDITED', subject: 'CS503', performedByName: 'Prof. Anjali Verma', role: 'hod', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), details: 'Approved Medical Certificate for student 22CS045 (Absent -> Excused)' }
        ]
      }
    };
  }

  // Default fallback response
  return {
    data: {
      success: true,
      message: 'Operation completed successfully (Demo Mode)',
      data: null
    }
  };
};
