
const { userData } = require('../models');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');


exports.signup = async (req, res, next) => {
  try {
    const signupSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      contact_number: Joi.string(),
      password: Joi.string().required(),
      profile_picture: Joi.string(),
      online_status: Joi.string(),
      last_seen: Joi.string(),
    });
    const { error, value } = signupSchema.validate(req.body);
    console.log('data', value)
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { name, email, contact_number, password, profile_picture, online_status, last_seen } = value;
    console.log('data', name, email, contact_number, password, profile_picture, online_status, last_seen)
    const hashedPassword = await bcrypt.hash(password, 10);
    // const jwtSecret = process.env.JWT_SECRET;
    // const token = jwt.sign({ userId: name }, jwtSecret);
    const userdata = await userData.create({
      name,
      email,
      contact_number,
      password: hashedPassword,
      profile_picture,
      online_status,
      last_seen,
    });
    res.status(201).json({ user: userdata });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('email, password ===>', req.body)
    const user = await userData.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
    return res.status(200).json({ message: 'User logged in successfully', user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.logout = async (req, res, next) => {
  try {

  } catch (err) {

  }
}
exports.getUserData = async (req, res, next) => {
  try {
    const data = await userData.findOne({ where: { id: req.params.id } }); 
    console.log('data====>', data);
    res.status(200).json({ data: data.dataValues });
  } catch (err) {
    next(err);
  }
}
exports.getAllUserData = async (req, res, next) => {
  try {
    const data = await userData.findAll();
    const modifiedData = data.map(userObj => {
      const imageUrl = `${req.protocol}://${req.get('host')}/public/${userObj.profile_picture}`;
      return {
        ...userObj.toJSON(),
        profile_picture: imageUrl
      };
    });
    res.status(200).json({ data: modifiedData });
  } catch (err) {
    next(err);
    res.status(401).json({ error: err.toString() });
  }
};
exports.updateUserData = async (req, res, next) => {
  try {
    const { id } = req.params;
    let image = '';
    if (req.file) {
      image = req.file.filename;
    }
    const {
      name,
      email,
      contact_number,
      profile_picture,
      online_status,
      last_seen,
      token,
    } = req.body;

    const user = await userData.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedData = {
      name: name || user.name,
      email: email || user.email,
      contact_number: contact_number || user.contact_number,
      profile_picture: image || user.profile_picture,
      online_status: online_status || user.online_status,
      last_seen: last_seen || user.last_seen,
      token: token || user.token,
    };
    const data = await userData.update(updatedData, { where: { id } });
    res.status(201).json({ message: 'user profile updated successfully' });
  } catch (err) {
    next(err);
  }
};
