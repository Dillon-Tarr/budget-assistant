const { Budget } = require('../models/budget');

const auth = require('../middleware/auth');
const checkTokenBlacklist = require('../middleware/checkTokenBlacklist');
const express = require('express');
const router = express.Router();

router.post('/new-budget', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.budgetName) return res.status(400).send('budgetName must be supplied in the request body.');

    const budget = new Budget({
      name: req.body.budgetName,
      managers: [req.user.loginName],
      viewers: [],
      income: [],
      outgo: [],
      changeHistory: [ {user: req.user.loginName, description: "This budget was created." } ],
      requestedChanges: [],
    });
    await budget.save();

    return res.send({ status: `${budget.name} created successfully!`, budget: budget });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;