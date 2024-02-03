const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign({ _id }, jwtkey, { expiresIn: '3d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be contain one uppercase, numbers and characters.',
      });
    }

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User doesnt exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user._id);

    if (token) {
      return res
        .status(200)
        .json({ _id: user._id, name: user.name, email, token });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const allUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  allUsers
};
