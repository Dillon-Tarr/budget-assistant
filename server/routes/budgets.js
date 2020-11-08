const { Budget } = require('../models/budget');

const auth = require('../middleware/auth');
const checkTokenBlacklist = require('../middleware/checkTokenBlacklist');
const express = require('express');
const router = express.Router();

router.post('/new-budget', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).send('name (of the budget) must be supplied in the request body.');

    const budget = new Budget({
      name: req.body.name,
      managers: [req.user.loginName],
      viewers: [],
      income: [],
      outgo: [],
      changeHistory: [ { user: req.user.loginName, description: "This budget was created." } ],
      requestedChanges: [],
    });
    await budget.save();

    return res.send({ status: `${budget.name} created successfully!`, budget: budget });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete('/:id/delete-budget', auth, checkTokenBlacklist, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    return res.send({ status: `${budget.name} deleted successfully.` });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post('/:id/add-income', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!(req.body.name && req.body.startDate && req.body.dollarsPerOccurrence)) return res.status(400).send('name, startDate, and dollarsPerOccurrence must be supplied in the request body.');
    if (!typeof req.body.startDate === "string") return res.status(400).send('startDate must be a string representing Unix time.');
    if (! typeof req.body.dollarsPerOccurrence === "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
    const name = req.body.name,
          startDate = new Date(parseInt(req.body.startDate)),
          dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    let isRecurring, inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, daysOfMonth;
    if (req.body.isRecurring) {
      if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If isRecurring is true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
      if (!typeof req.body.inclusiveEndDate === "string") return res.status(400).send('inclusiveEndDate must be a string representing Unix time.');
      inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
      if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
      if (! typeof req.body.referencePeriod === "string") return res.status(400).send('referencePeriod must be a string.');
      if (! typeof req.body.multiplesOfPeriod === "string") return res.status(400).send('multiplesOfPeriod must be a string.');
      if (! typeof req.body.weekOfMonthText === "string") return res.status(400).send('weekOfMonthText must be a string.');
      let isArray = Array.isArray(req.body.daysOfWeek);
      if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
      isArray = Array.isArray(req.body.daysOfMonth);
      if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
      isRecurring = true;
      referencePeriod = req.body.referencePeriod;
      multiplesOfPeriod = req.body.multiplesOfPeriod;
      weekOfMonthText = req.body.weekOfMonthText;
      daysOfWeek = req.body.daysOfWeek;
      daysOfMonth = req.body.daysOfMonth;
    }
    else {
      isRecurring = false;
      inclusiveEndDate = new Date(parseInt(req.body.startDate)),
      referencePeriod = "N/A";
      multiplesOfPeriod = "N/A";
      weekOfMonthText = "N/A";
      daysOfWeek = ["N/A"];
      daysOfMonth = ["N/A"];
    }
    
    const newIncome = {
      name: name,
      startDate: startDate,
      dollarsPerOccurrence: dollarsPerOccurrence,
      isRecurring: isRecurring,
      inclusiveEndDate: inclusiveEndDate,
      referencePeriod: referencePeriod,
      multiplesOfPeriod: multiplesOfPeriod,
      weekOfMonthText: weekOfMonthText,
      daysOfWeek: daysOfWeek,
      daysOfMonth: daysOfMonth,
    }
    
    const budget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { income: newIncome } },
      { new: true });
    budget.save();

    const income = [...budget.income];
    income.reverse();
    const change = {
      user: req.user.loginName,
      description: `"${income[0].name}" income was added.`,
      referenceId: `${income[0]._id}`
    }
    
    const sameBudget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { changeHistory: change} },
      { new: true });
    sameBudget.save();

    return res.send({ status: `${budget.name} updated successfully.`, newIncome: income[0] });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;