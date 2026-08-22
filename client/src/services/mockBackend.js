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
    name: 'Shubham Mishra (Campus Admin)',
    email: 'shubhammishra23082004@gmail.com',
    password: 'Shubham@123',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM-001',
    designation: 'Dean of Student Welfare & Campus Admin',
    phone: '9876500001',
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

    // Admin email matching (Shubham Mishra)
    if (normEmail.includes('shubham') || normEmail.includes('admin@campusfix.edu')) {
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
          { _id: 'c_dean', name: '👑 Dean & Campus Admin (Shubham Mishra)', role: 'admin', status: 'online' },
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

  // Default fallback response
  return {
    data: {
      success: true,
      message: 'Operation completed successfully (Demo Mode)',
      data: null
    }
  };
};
