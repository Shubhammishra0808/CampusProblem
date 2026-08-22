const Notification = require('../models/Notification');

const createNotification = async ({ recipient, title, message, type = 'System', linkUrl = '' }) => {
  try {
    if (!recipient) return null;
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      linkUrl
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return null;
  }
};

module.exports = {
  createNotification
};
