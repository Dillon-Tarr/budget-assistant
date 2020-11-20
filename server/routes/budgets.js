const { Budget } = require('../models/budget');
const { getAllOccurrences } = require('../helpers/get-occurrences');

const auth = require('../middleware/auth');
const checkTokenBlacklist = require('../middleware/checkTokenBlacklist');
const express = require('express');
const router = express.Router();

router.get('/:id', auth, checkTokenBlacklist, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id, { createdDate: 0, __v: 0 }, function(err, results){ if (err) return res.status(404).send(`The following error occurred when trying to find managed budgets: ${err}`);} );
    for (let i = 0; i < budget.income.length; i++){
      budget.income[i].occurrences = getAllOccurrences(budget.income[i]);
    }
    for (let i = 0; i < budget.outgo.length; i++){
      budget.outgo[i].occurrences = getAllOccurrences(budget.outgo[i]);
    }
    return res.send({ status: `Successfully found ${budget.name}.`, budget: budget });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

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
    if (typeof req.body.startDate !== "string" || req.body.startDate.length < 13) return res.status(400).send('startDate must be a string representing Unix time in milliseconds.');
    if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
    const name = req.body.name;
    const startDate = new Date(parseInt(req.body.startDate));
    const dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    let isRecurring, inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, daysOfMonth;
    
    if (req.body.isRecurring) {
      if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If isRecurring is true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
      if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
      if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
      if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
      if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
      if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
      let isArray = Array.isArray(req.body.daysOfWeek);
      if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
      isArray = Array.isArray(req.body.daysOfMonth);
      if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
      isRecurring = true;
      inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
      referencePeriod = req.body.referencePeriod;
      multiplesOfPeriod = req.body.multiplesOfPeriod;
      weekOfMonthText = req.body.weekOfMonthText;
      daysOfWeek = req.body.daysOfWeek;
      daysOfMonth = req.body.daysOfMonth;
    }
    else {
      isRecurring = false;
      inclusiveEndDate = new Date(parseInt(req.body.startDate));
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

    const change = {
      user: req.user.loginName,
      description: `"${budget.income[budget.income.length - 1].name}" income was added.`,
      referenceId: `${budget.income[budget.income.length - 1]._id}`
    }
    
    const sameBudget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { changeHistory: change} },
      { new: true });
    sameBudget.save();

    return res.send({ status: `${budget.name} updated successfully.`, newIncome: budget.income[budget.income.length - 1] });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post('/:id/add-outgo', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!(req.body.name && req.body.startDate && req.body.dollarsPerOccurrence)) return res.status(400).send('name, startDate, and dollarsPerOccurrence must be supplied in the request body.');
    if (typeof req.body.startDate !== "string" || req.body.startDate.length < 13) return res.status(400).send('startDate must be a string representing Unix time in milliseconds.');
    if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
    const name = req.body.name;
    let category = "Uncategorized";
    if (req.body.category) category = req.body.category;
    const startDate = new Date(parseInt(req.body.startDate));
    const dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    const muteRemindersUntil = new Date(1577836800000);
    let isRecurring, inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, daysOfMonth, doRemind, remindThisManyDaysBefore;
    
    if (req.body.isRecurring) {
      if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If isRecurring is true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
      if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
      if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
      if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
      if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
      if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
      let isArray = Array.isArray(req.body.daysOfWeek);
      if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
      isArray = Array.isArray(req.body.daysOfMonth);
      if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
      isRecurring = true;
      inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
      referencePeriod = req.body.referencePeriod;
      multiplesOfPeriod = req.body.multiplesOfPeriod;
      weekOfMonthText = req.body.weekOfMonthText;
      daysOfWeek = req.body.daysOfWeek;
      daysOfMonth = req.body.daysOfMonth;
    }
    else {
      isRecurring = false;
      inclusiveEndDate = new Date(parseInt(req.body.startDate));
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
      category: category,
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

    const change = {
      user: req.user.loginName,
      description: `"${budget.outgo[budget.outgo.length - 1].name}" outgo was added.`,
      referenceId: `${budget.outgo[budget.outgo.length - 1]._id}`
    }
    
    const sameBudget = await Budget.findByIdAndUpdate(req.params.id,
      { $push: { changeHistory: change} },
      { new: true });
    sameBudget.save();

    return res.send({ status: `${budget.name} updated successfully.`, newOutgo: budget.outgo[budget.outgo.length - 1] });

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

router.put('/:id/modify-income', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.incomeId) return res.status(400).send('incomeId must be supplied in the request body.');
    if (typeof req.body.incomeId !== "string") return res.status(400).send('The value of incomeId must be a string.');

    const budget = await Budget.findById(req.params.id);
    const incomeIndex = budget.income.findIndex((income) => income._id == req.body.incomeId);
    if (incomeIndex === -1) return res.status(404).send(`Income with incomeId "${req.body.incomeId}" was not found in ${budget.name}.`);
    
    if (req.body.name) budget.income[incomeIndex].name = req.body.name;
    if (req.body.startDate){
      if (typeof req.body.startDate !== "string" || req.body.startDate.length < 13) return res.status(400).send('startDate must be a string representing Unix time in milliseconds.');
      budget.income[incomeIndex].startDate = new Date(parseInt(req.body.startDate));
    }
    if (req.body.dollarsPerOccurrence){
      if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
      budget.income[incomeIndex].dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    }
    
    if (req.body.isRecurring === false) {
      budget.income[incomeIndex].isRecurring = false;
      budget.income[incomeIndex].inclusiveEndDate = new Date(parseInt(req.body.startDate));
      budget.income[incomeIndex].referencePeriod = "N/A";
      budget.income[incomeIndex].multiplesOfPeriod = "N/A";
      budget.income[incomeIndex].weekOfMonthText = "N/A";
      budget.income[incomeIndex].daysOfWeek = ["N/A"];
      budget.income[incomeIndex].daysOfMonth = ["N/A"];
    }
    else { // req.body.isRecurring === true
      if (budget.income[incomeIndex].isRecurring === false) { // was not recurring before
        if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If changing isRecurring to true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
        if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
        inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
        if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
        if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
        if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
        let isArray = Array.isArray(req.body.daysOfWeek);
        if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
        isArray = Array.isArray(req.body.daysOfMonth);
        if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
        budget.income[incomeIndex].isRecurring = true;
        budget.income[incomeIndex].inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        budget.income[incomeIndex].referencePeriod = req.body.referencePeriod;
        budget.income[incomeIndex].multiplesOfPeriod = req.body.multiplesOfPeriod;
        budget.income[incomeIndex].weekOfMonthText = req.body.weekOfMonthText;
        budget.income[incomeIndex].daysOfWeek = req.body.daysOfWeek;
        budget.income[incomeIndex].daysOfMonth = req.body.daysOfMonth;
      }
      else { // already was recurring
        if (req.body.inclusiveEndDate){
          if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
          budget.income[incomeIndex].inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        }
        if (req.body.referencePeriod){
          if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
          budget.income[incomeIndex].referencePeriod = req.body.referencePeriod;
        }
        if (req.body.multiplesOfPeriod){
          if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
          budget.income[incomeIndex].multiplesOfPeriod = req.body.multiplesOfPeriod;
        }
        if (req.body.weekOfMonthText){
          if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
          budget.income[incomeIndex].weekOfMonthText = req.body.weekOfMonthText;
        }
        if (req.body.daysOfWeek){
          const isArray = Array.isArray(req.body.daysOfWeek);
          if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
          budget.income[incomeIndex].daysOfWeek = req.body.daysOfWeek;
        }
        if (req.body.daysOfMonth){
          const isArray = Array.isArray(req.body.daysOfMonth);
          if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
          budget.income[incomeIndex].daysOfMonth = req.body.daysOfMonth;
        }
      }
    }
    const change = {
      user: req.user.loginName,
      description: `"${budget.income[incomeIndex].name}" income was modified.`,
      referenceId: `${budget.income[incomeIndex]._id}`
    }
    budget.changeHistory.push(change);
    budget.save();

    return res.send({ status: `${budget.name} updated successfully.`, updatedIncome: budget.income[incomeIndex] });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put('/:id/modify-outgo', auth, checkTokenBlacklist, async (req, res) => {
  try {
    if (!req.body.outgoId) return res.status(400).send('outgoId must be supplied in the request body.');
    if (typeof req.body.outgoId !== "string") return res.status(400).send('The value of outgoId must be a string.');

    const budget = await Budget.findById(req.params.id);
    const outgoIndex = budget.outgo.findIndex((outgo) => outgo._id == req.body.outgoId);
    if (outgoIndex === -1) return res.status(404).send(`Outgo with outgoId "${req.body.outgoId}" was not found in ${budget.name}.`);
    
    if (req.body.name) budget.outgo[outgoIndex].name = req.body.name;
    if (req.body.category) budget.outgo[outgoIndex].category = req.body.category;
    if (req.body.startDate){
      if (typeof req.body.startDate !== "string" || req.body.startDate.length < 13) return res.status(400).send('startDate must be a string representing Unix time in milliseconds.');
      budget.outgo[outgoIndex].startDate = new Date(parseInt(req.body.startDate));
    }
    if (req.body.dollarsPerOccurrence){
      if (typeof req.body.dollarsPerOccurrence !== "number") return res.status(400).send('dollarsPerOccurrence must be a number.');
      budget.outgo[outgoIndex].dollarsPerOccurrence = parseFloat(req.body.dollarsPerOccurrence.toFixed(2));
    }
    
    if (req.body.isRecurring === false) {
      budget.outgo[outgoIndex].isRecurring = false;
      budget.outgo[outgoIndex].inclusiveEndDate = new Date(parseInt(req.body.startDate));
      budget.outgo[outgoIndex].referencePeriod = "N/A";
      budget.outgo[outgoIndex].multiplesOfPeriod = "N/A";
      budget.outgo[outgoIndex].weekOfMonthText = "N/A";
      budget.outgo[outgoIndex].daysOfWeek = ["N/A"];
      budget.outgo[outgoIndex].daysOfMonth = ["N/A"];
    }
    else { // req.body.isRecurring === true
      if (budget.outgo[outgoIndex].isRecurring === false) { // was not recurring before
        if (!(req.body.inclusiveEndDate && req.body.referencePeriod && req.body.multiplesOfPeriod && req.body.weekOfMonthText && req.body.daysOfWeek && req.body.daysOfMonth)) return res.status(400).send('If changing isRecurring to true... inclusiveEndDate, referencePeriod, multiplesOfPeriod, weekOfMonthText, daysOfWeek, and daysOfMonth must be supplied in the request body. For properties that do not apply to the recurring event, supply the value "N/A" (for strings) or ["N/A"] (for arrays).');
        if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
        inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        if (req.body.inclusiveEndDate < req.body.startDate) return res.status(400).send('inclusiveEndDate must be a later date than startDate.');
        if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
        if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
        if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
        let isArray = Array.isArray(req.body.daysOfWeek);
        if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
        isArray = Array.isArray(req.body.daysOfMonth);
        if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
        budget.outgo[outgoIndex].isRecurring = true;
        budget.outgo[outgoIndex].inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        budget.outgo[outgoIndex].referencePeriod = req.body.referencePeriod;
        budget.outgo[outgoIndex].multiplesOfPeriod = req.body.multiplesOfPeriod;
        budget.outgo[outgoIndex].weekOfMonthText = req.body.weekOfMonthText;
        budget.outgo[outgoIndex].daysOfWeek = req.body.daysOfWeek;
        budget.outgo[outgoIndex].daysOfMonth = req.body.daysOfMonth;
      }
      else { // already was recurring
        if (req.body.inclusiveEndDate){
          if (typeof req.body.inclusiveEndDate !== "string" || req.body.inclusiveEndDate.length < 13) return res.status(400).send('inclusiveEndDate must be a string representing Unix time in milliseconds.');
          budget.outgo[outgoIndex].inclusiveEndDate = new Date(parseInt(req.body.inclusiveEndDate));
        }
        if (req.body.referencePeriod){
          if (typeof req.body.referencePeriod !== "string") return res.status(400).send('referencePeriod must be a string.');
          budget.outgo[outgoIndex].referencePeriod = req.body.referencePeriod;
        }
        if (req.body.multiplesOfPeriod){
          if (typeof req.body.multiplesOfPeriod !== "string") return res.status(400).send('multiplesOfPeriod must be a string.');
          budget.outgo[outgoIndex].multiplesOfPeriod = req.body.multiplesOfPeriod;
        }
        if (req.body.weekOfMonthText){
          if (typeof req.body.weekOfMonthText !== "string") return res.status(400).send('weekOfMonthText must be a string.');
          budget.outgo[outgoIndex].weekOfMonthText = req.body.weekOfMonthText;
        }
        if (req.body.daysOfWeek){
          const isArray = Array.isArray(req.body.daysOfWeek);
          if (!isArray) return res.status(400).send('daysOfWeek must be an array.');
          budget.outgo[outgoIndex].daysOfWeek = req.body.daysOfWeek;
        }
        if (req.body.daysOfMonth){
          const isArray = Array.isArray(req.body.daysOfMonth);
          if (!isArray) return res.status(400).send('daysOfMonth must be an array.');
          budget.outgo[outgoIndex].daysOfMonth = req.body.daysOfMonth;
        }
      }
    }
    if (req.body.doRemind === false){
      budget.outgo[outgoIndex].doRemind = false;
      budget.outgo[outgoIndex].remindThisManyDaysBefore = "N/A";
      budget.outgo[outgoIndex].muteRemindersUntil = new Date(1577836800000);
    }
    else { // req.body.doRemind === true
      if (budget.outgo[outgoIndex].doRemind === false) { // was not reminding before
        if (!(req.body.remindThisManyDaysBefore && (req.body.muteRemindersUntil || req.body.muteRemindersUntil === false))) return res.status(400).send('If doRemind is changed to true... remindThisManyDaysBefore and muteRemindersUntil must be included in the request body.');
        if (typeof req.body.remindThisManyDaysBefore !== "string") return res.status(400).send('remindThisManyDaysBefore must be a string.');
        if (!(typeof req.body.muteRemindersUntil === "boolean" && req.body.muteRemindersUntil === false) && !(typeof req.body.muteRemindersUntil === "string" && req.body.muteRemindersUntil.length >= 13)) return res.status(400).send(`muteRemindersUntil must be the Boolean 'false' or a string representing Unix time in milliseconds.`);
        budget.outgo[outgoIndex].doRemind = true;
        budget.outgo[outgoIndex].remindThisManyDaysBefore = req.body.remindThisManyDaysBefore;
        if (req.body.muteRemindersUntil == false) {
          budget.outgo[outgoIndex].muteRemindersUntil = new Date(1577836800000);
        }
        else {
          budget.outgo[outgoIndex].muteRemindersUntil = req.body.muteRemindersUntil;
        }
      }
    }
    const change = {
      user: req.user.loginName,
      description: `"${budget.outgo[outgoIndex].name}" outgo was modified.`,
      referenceId: `${budget.outgo[outgoIndex]._id}`
    }
    budget.changeHistory.push(change);
    budget.save();

    return res.send({ status: `${budget.name} updated successfully.`, updatedOutgo: budget.outgo[outgoIndex] });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;