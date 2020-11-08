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
    if (typeof req.body.startDate !== "string") return res.status(400).send('startDate must be a string representing Unix time.');
    if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
    const name = req.body.name,
          startDate = new Date(parseInt(req.body.startDate)),
          dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    let isRecurring, inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, daysOfMonth;
    
    if (req.body.isRecurring) {
      if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If isRecurring is true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
      if (typeof req.body.inclusiveEndDate !== "string") return res.status(400).send('inclusiveEndDate must be a string representing Unix time.');
      inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
      if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
      if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
      if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
      if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
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

router.post('/:id/add-outgo', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!(req.body.name && req.body.startDate && req.body.dollarsPerOccurrence)) return res.status(400).send('name, startDate, and dollarsPerOccurrence must be supplied in the request body.');
    if (typeof req.body.startDate !== "string") return res.status(400).send('startDate must be a string representing Unix time.');
    if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
    const name = req.body.name,
          startDate = new Date(parseInt(req.body.startDate)),
          dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2)),
          muteRemindersUntil = new Date(1577836800000);
    let isRecurring, inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, daysOfMonth, doRemind, remindThisManyDaysBefore;
    
    if (req.body.isRecurring) {
      if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If isRecurring is true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
      if (typeof req.body.inclusiveEndDate !== "string") return res.status(400).send('inclusiveEndDate must be a string representing Unix time.');
      inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
      if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
      if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
      if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
      if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
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

    if (req.body.doRemind){
      if (!(req.body.remindThisManyDaysBefore && typeof req.body.remindThisManyDaysBefore === "string")) return res.status(400).send('If doRemind is true... remindThisManyDaysBefore must be included in the request body as a string');
      doRemind = true;
      remindThisManyDaysBefore = req.body.remindThisManyDaysBefore;
    }
    else {
      doRemind = false;
      remindThisManyDaysBefore = "N/A";
    }
    
    const newOutgo = {
      name: name,
      startDate: startDate,
      dollarsPerOccurrence: dollarsPerOccurrence,
      doRemind: doRemind,
      remindThisManyDaysBefore: remindThisManyDaysBefore,
      muteRemindersUntil: muteRemindersUntil,
      isRecurring: isRecurring,
      inclusiveEndDate: inclusiveEndDate,
      referencePeriod: referencePeriod,
      multiplesOfPeriod: multiplesOfPeriod,
      weekOfMonthText: weekOfMonthText,
      daysOfWeek: daysOfWeek,
      daysOfMonth: daysOfMonth,
    }
    
    const budget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { outgo: newOutgo } },
      { new: true });
    budget.save();

    const outgo = [...budget.outgo];
    outgo.reverse();
    const change = {
      user: req.user.loginName,
      description: `"${outgo[0].name}" outgo was added.`,
      referenceId: `${outgo[0]._id}`
    }
    
    const sameBudget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { changeHistory: change} },
      { new: true });
    sameBudget.save();

    return res.send({ status: `${budget.name} updated successfully.`, newOutgo: outgo[0] });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete('/:id/remove-income', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.incomeId) return res.status(400).send('incomeId must be supplied in the request body.');
    if (typeof req.body.incomeId !== "string") return res.status(400).send('The value of incomeId must be a string.');
    
    const budget = await Budget.findById(req.params.id);
    const incomeIndex = budget.income.findIndex((income) => income._id == req.body.incomeId);
    if (incomeIndex === -1) return res.status(400).send(`Budget "${req.budget.loginName}" has no income to delete with _id "${req.body.incomeId}".`);
    budget.income.splice(incomeIndex, 1);
    budget.save();
    return res.send( `Income with _id ${req.body.incomeId} deleted successfully.` );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete('/:id/remove-outgo', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.outgoId) return res.status(400).send('outgoId must be supplied in the request body.');
    if (typeof req.body.outgoId !== "string") return res.status(400).send('The value of outgoId must be a string.');
    
    const budget = await Budget.findById(req.params.id);
    const outgoIndex = budget.outgo.findIndex((outgo) => outgo._id == req.body.outgoId);
    if (outgoIndex === -1) return res.status(400).send(`Budget "${req.budget.loginName}" has no outgo to delete with _id "${req.body.outgoId}".`);
    budget.outgo.splice(outgoIndex, 1);
    budget.save();
    return res.send( `Outgo with _id ${req.body.outgoId} deleted successfully.` );

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;