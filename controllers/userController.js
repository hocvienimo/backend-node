const User = require('../models/User');
const { sendRegistrationEmail } = require('../middlewares/userMiddleware');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      avatar: req.body.avatar,
      role: req.body.role || 'register',
    });

    await newUser.save();
    // Gửi email sau khi người dùng được tạo thành công
    sendRegistrationEmail(newUser.email, newUser.name);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Trả về lỗi nếu quá trình tạo người dùng gặp lỗi (ví dụ như email đã tồn tại)
    if (error.code === 11000) {
      // Lỗi trùng lặp key email
      return res.status(400).json({ error: 'Email is already in use' });
    }
    res.status(400).json({ error: error.message });
  }
};
module.exports = { getUsers, createUser };
