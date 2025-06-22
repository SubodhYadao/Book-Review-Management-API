const jwt = require('jsonwebtoken');
const User = require('../models/User');


//JWT Gen
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });  //validity of token for 7d
};

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });  //srch username
    if (userExists)
      return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({ username, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
