//models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { sendRegistrationEmail } = require('../middlewares/userMiddleware');

// Định nghĩa User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match'
    },
    select: false, // Không lưu vào DB
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['admin', 'leader', 'editor', 'content', 'register'],
    default: 'register'
  }
}, { timestamps: true });

// Middleware để mã hóa password trước khi lưu
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(13);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined; // Xóa confirmPassword sau khi kiểm tra

    next();
  } catch (error) {
    return next(error);
  }
});

// Gửi email sau khi tạo user thành công
userSchema.post('save', function (doc, next) {
  try {
    sendRegistrationEmail(doc.email, doc.name);
  } catch (error) {
    console.error('Error sending email:', error);
  }
  next();
});

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;