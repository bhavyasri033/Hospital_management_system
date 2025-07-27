const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    // If doctor, also create Doctor record and link
    if (role === 'doctor') {
      const doctor = new Doctor({
        name,
        email,
        specialization: req.body.specialization || 'General Physician',
        phone: req.body.phone || 'N/A',
        gender: req.body.gender || 'Other',
        status: 'Active'
      });
      await doctor.save();
      // Link doctorId to user
      user.doctorId = doctor._id;
      await user.save();
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // For now, just return a success message and user info (no JWT yet)
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, doctorId: user.doctorId } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 