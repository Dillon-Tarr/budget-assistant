const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
  try {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ $or: [{ loginName: req.body.loginNameOrEmailAddress}, { emailAddress: req.body.loginNameOrEmailAddress }] });
  if (!user) return res.status(400).send('Invalid login. Please try again.');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid login. Please try again.');
  user.lastLoginDate = Date.now();
  user.loginCount++;
  user.save();
  const token = user.generateAuthToken();
  res.send(token);
  
  } catch (ex) {
  return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

function validateLogin(req) {
 const schema = Joi.object({
 loginNameOrEmailAddress: Joi.string().min(3).max(255).required(),
 password: Joi.string().min(8).max(255).required()
 });
 return schema.validate(req);
}

module.exports = router;
