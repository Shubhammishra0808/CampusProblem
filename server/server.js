const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS & Body Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'CampusFix API Server',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/lost-found', require('./routes/lostFoundRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Global Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` CampusFix Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
});
