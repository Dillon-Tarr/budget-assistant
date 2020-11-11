const { User } = require('../models/user');
const { BlacklistedToken } = require('../models/blacklistedToken');
const { Budget } = require('../models/budget');
const { setDateToMidday } = require('../helpers/manipulate-dates');

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
    const salt = await bcrypt.genSalt(10);
    const userInfo = {
      loginName: req.body.loginName,
      displayName: req.body.displayName,
      password: await bcrypt.hash(req.body.password, salt),
    };
    if (req.body.emailAddress && req.body.emailAddress.length > 0){
      user = await User.findOne({ emailAddress: req.body.emailAddress });
      if (user) return res.status(400).send('Someone is already registered with that email address.');
      userInfo.emailAddress = req.body.emailAddress;
    }

    user = new User(userInfo);
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

router.delete('/delete-account', auth, checkTokenBlacklist, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.user._id);
    if (!userToDelete) return res.status(404).send( `User "${req.user.loginName}" not found.` );
    
    const managedBudgets = await Budget.find( { managers: req.user.loginName }, { managers: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find managed budgets: ${err}`);} );
    if (managedBudgets) {
      for (let i = 0; i < managedBudgets.length; i++){
        if (managedBudgets[i].managers.length > 1){
          const budget = await Budget.findByIdAndUpdate(managedBudgets[i]._id,
          {
            $pullAll: { managers: [req.user.loginName] }
          });
          budget.save();
        }
        else {
          await Budget.findByIdAndDelete(managedBudgets[i]._id);
        }
      }
    }
    const viewedBudgets = await Budget.find( { viewers: req.user.loginName }, { _id: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find managed budgets: ${err}`);} );
    if (viewedBudgets) {
      for (let i = 0; i < viewedBudgets.length; i++){
        const budget = await Budget.findByIdAndUpdate(viewedBudgets[i]._id,
        {
          $pullAll: { viewers: [req.user.loginName] }
        });
        budget.save();
      }
    }

    const oldToken = req.header('x-auth-token');
    const blacklistedToken = new BlacklistedToken({
      string: oldToken
    });
    await blacklistedToken.save();

    userToDelete.deleteOne((err, results) => { if (err) return res.status(404).send(`The following error occurred when trying to delete user "${req.user.loginName}": ${err}`);} );

    return res.send( `User account deleted successfully.` );

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

router.post('/new-goal', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.text) return res.status(400).send(`You must include "text" (the text describing the goal) in the request body.`);
    const goal = {
      text: req.body.text
    };
    if (req.body.estimatedCompletionDate) goal.estimatedCompletionDate = req.body.estimatedCompletionDate;
    
    const user = await User.findByIdAndUpdate(req.user._id,
    {
      $push: { goals: goal }
    },
    { new: true });
    user.save();

    return res.send( { status: "Goal added successfully.", goal: goal } );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete('/delete-goal', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.goalId) return res.status(400).send(`You must include "goalId" (the _id of the goal to delete) in the request body.`);
    const user = await User.findByIdAndUpdate(req.user._id,
      {
        $pull: { goals: { _id: req.body.goalId } }
      },
      { new: true });
    user.save();

    return res.send({ status: `Goal with _id ${req.body.goalId} deleted successfully.` });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/modify-goal', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.goalId) return res.status(400).send(`You must include "goalId" (the _id of the goal to modify) in the request body.`);
    const user = await User.findById(req.user._id);
    const goalIndex = user.goals.findIndex(goal => goal._id == req.body.goalId);
    if (goalIndex === -1) return res.status(400).send(`Goal with _id ${req.body.goalId} not found.`);
    if (req.body.text) user.goals[goalIndex].text = req.body.text;
    let isComplete = user.goals[goalIndex].isComplete;
    if (req.body.isComplete === true && !isComplete){
      isComplete = true;
      user.goals[goalIndex].isComplete = true;
      user.goals[goalIndex].completedDate = setDateToMidday(Date.now());
      await User.findOneAndUpdate({ "_id": req.user._id, "goals._id": req.body.goalId },
        { $unset: { "goals.$.estimatedCompletionDate": "" } });
    }
    if (req.body.isComplete === false && isComplete){
      isComplete = false;
      user.goals[goalIndex].isComplete = false;
      await User.findOneAndUpdate({ "_id": req.user._id, "goals._id": req.body.goalId },
        { $unset: { "goals.$.completedDate": "" } });
    }
    if (req.body.estimatedCompletionDate && !isComplete) user.goals[goalIndex].estimatedCompletionDate = setDateToMidday(req.body.estimatedCompletionDate);
    if (req.body.estimatedCompletionDate === false){
      await User.findOneAndUpdate({ "_id": req.user._id, "goals._id": req.body.goalId },
      { $unset: { "goals.$.estimatedCompletionDate": "" } });
    }
    if (req.body.completedDate && setDateToMidday(req.body.completedDate).getTime() <= setDateToMidday(Date.now()).getTime() && isComplete) user.goals[goalIndex].completedDate = setDateToMidday(req.body.completedDate);
      
    user.save();

    return res.send({ status: `Goal with _id ${req.body.goalId} modified successfully.` });

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
    { new: true });
  user.save();

  const managedBudgets = await Budget.find( { managers: req.user.loginName }, { _id: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find managed budgets: ${err}`);} );
  if (managedBudgets) {
    for (let i = 0; i < managedBudgets.length; i++){
      const budget = await Budget.findByIdAndUpdate(managedBudgets[i]._id,
      {
        $pullAll: { managers: [req.user.loginName] }
      });
      budget.save();
    }
    for (let i = 0; i < managedBudgets.length; i++){
      const budget = await Budget.findByIdAndUpdate(managedBudgets[i]._id,
      {
        $push: { managers: req.body.loginName }
      });
      budget.save();
    }
  }
  const viewedBudgets = await Budget.find( { viewers: req.user.loginName }, { _id: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find managed budgets: ${err}`);} );
  if (viewedBudgets) {
    for (let i = 0; i < viewedBudgets.length; i++){
      const budget = await Budget.findByIdAndUpdate(viewedBudgets[i]._id,
      {
        $pullAll: { viewers: [req.user.loginName] }
      });
      budget.save();
    }
    for (let i = 0; i < viewedBudgets.length; i++){
      const budget = await Budget.findByIdAndUpdate(viewedBudgets[i]._id,
      {
        $push: { viewers: req.body.loginName }
      });
      budget.save();
    }
  }
  const changedBudgets = await Budget.find( { "changeHistory.user": req.user.loginName }, { _id: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find changed budgets: ${err}`);} );
  if (changedBudgets) {
    for (let i = 0; i < changedBudgets.length; i++){
      const budget = await Budget.findById(changedBudgets[i]._id);
      for (let j = 0; j < budget.changeHistory.length; j++){
        if (budget.changeHistory[j].user === req.user.loginName) budget.changeHistory[j].user = req.body.loginName;
      }
      budget.save();
    }
  }
  const changeRequestedBudgets = await Budget.find( { "requestedChanges.user": req.user.loginName }, { _id: 1 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find "changeRequested" budgets: ${err}`);} );
  if (changeRequestedBudgets) {
    for (let i = 0; i < changeRequestedBudgets.length; i++){
      const budget = await Budget.findById(changeRequestedBudgets[i]._id);
      for (let j = 0; j < budget.requestedChanges.length; j++){
        if (budget.requestedChanges[j].user === req.user.loginName) budget.requestedChanges[j].user = req.body.loginName;
      }
      budget.save();
    }
  }
  
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
    { new: true });
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
    { password: await bcrypt.hash(req.body.password, salt) });
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
    { new: true });
  user.save();

  return res.send({ status: 'Email address updated successfully.', newEmailAddress: user.emailAddress });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;