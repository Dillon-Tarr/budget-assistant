const { User } = require('../models/user');
const { BlacklistedToken } = require('../models/blacklistedToken');
const { Budget } = require('../models/budget');

const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const checkTokenBlacklist = require('../middleware/checkTokenBlacklist');
const express = require('express');
const router = express.Router();

router.post('/new-user', async (req, res) => {
  try {
    if (!(req.body.loginName && req.body.displayName && req.body.password)) return res.status(400).send('loginName, displayName, and password must be supplied in the request body.');

    let user = await User.findOne({ loginName: req.body.loginName });
    if (user) return res.status(400).send('Someone is already registered with that loginName.');
    if (req.body.emailAddress.length > 0){
      user = await User.findOne({ emailAddress: req.body.emailAddress });
      if (user) return res.status(400).send('Someone is already registered with that email address.');
    } 

    const salt = await bcrypt.genSalt(10);
    user = new User({
      loginName: req.body.loginName,
      displayName: req.body.displayName,
      password: await bcrypt.hash(req.body.password, salt),
      emailAddress: req.body.emailAddress
    });
    await user.save();

    const token = user.generateAuthToken();
    
    return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send({ _id: user._id, loginName: user.loginName });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post('/log-out', auth, async (req, res) => {
  try {
    const oldToken = req.header('x-auth-token');
    const blacklistedToken = new BlacklistedToken({
      string: oldToken
    });
    await blacklistedToken.save();

    return res.send( `${req.user.loginName} logged out successfully.` );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/update-login-name', auth, checkTokenBlacklist, async (req, res) => {
  try {
  if (!req.body.loginName) return res.status(400).send(`You must include "loginName" (the new loginName) in the request body.`);
  const loginNameTaken = await User.findOne({ loginName: req.body.loginName });
  if (loginNameTaken) return res.status(400).send('Someone is already registered with that loginName.');
  
  const user = await User.findByIdAndUpdate(req.user._id,
    { loginName: req.body.loginName },
    { new: true }
    );
  user.save();

  const oldToken = req.header('x-auth-token');
  const blacklistedToken = new BlacklistedToken({
    string: oldToken
  });
  await blacklistedToken.save();

  const newToken = user.generateAuthToken();
  
  return res
    .header('x-auth-token', newToken)
    .header('access-control-expose-headers', 'x-auth-token')
    .send({ status: `Login name updated successfully.`, newLoginName: user.loginName });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/update-display-name', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.displayName) return res.status(400).send(`You must include "displayName" (the new display name) in the request body.`);
  const user = await User.findByIdAndUpdate(req.user._id,
    { password: req.body.displayName },
    { new: true }
    );
  user.save();

  return res.send( { status: "Display name updated successfully.", newDisplayName: user.displayName } );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/update-password', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.password) return res.status(400).send(`You must include "password" (the new password) in the request body.`);
  const salt = await bcrypt.genSalt(10);
  const user = await User.findByIdAndUpdate(req.user._id,
    { password: await bcrypt.hash(req.body.password, salt) },
    { new: true }
    );
  user.save();

  return res.send( `Password updated successfully.` );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/update-email-address', auth, checkTokenBlacklist, async (req, res) => {
  try {
  if (!req.body.emailAddress) return res.status(400).send(`You must include "emailAddress" (the new email address) in the request body.`);
  const emailAddressTaken = await User.findOne({ emailAddress: req.body.emailAddress });
  if (emailAddressTaken) return res.status(400).send('Someone is already registered with that email address.');

  const user = await User.findByIdAndUpdate(req.user._id,
    { emailAddress: req.body.emailAddress },
    { new: true }
    );
  user.save();

  return res.send({ status: 'Email address updated successfully.', newEmailAddress: user.emailAddress });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;