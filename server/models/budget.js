const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 1},
  startDate: { type: Date, required: true }, // in Unix time
  dollarsPerOccurrence: { type: Number, required: true },
  isRecurring: { type: Boolean, required: true },
  inclusiveEndDate: { type: Date, required: false }, // in Unix time
  referencePeriod: { type: String, required: false }, // day, week, month, or year
  multiplesOfPeriod: { type: String, required: false }, // e.g. "3" (along with month) for the period to be every three months
  weekOfMonthText: { type: String, required: false }, // first, second, third, fourth, last
  daysOfWeek: {type: Array, required: false }, // Contains strings (e.g. "Monday", "Thursday") for when occurrences are on specific days of the week.
  daysOfMonth: {type: Array, required: false } // Contains numbers for when occurrences are on specific number days of the month.
});
const outgoSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 1},
  startDate: { type: Date, required: true }, // in Unix time
  dollarsPerOccurrence: { type: Number, required: true },
  doRemind: { type: Boolean, required: true, default: false },
  remindThisManyDaysBefore: { type: String, required: false },
  muteRemindersUntil: { type: Date, required: false },
  isRecurring: { type: Boolean, required: true },
  inclusiveEndDate: { type: Date, required: false }, // in Unix time
  referencePeriod: { type: String, required: false }, // day, week, month, or year
  multiplesOfPeriod: { type: String, required: false }, // e.g. "3" (along with month) for the period to be every three months
  weekOfMonthText: { type: String, required: false }, // first, second, third, fourth, last
  daysOfWeek: {type: Array, required: false }, // Contains strings (e.g. "Monday", "Thursday") for when occurrences are on specific days of the week.
  daysOfMonth: {type: Array, required: false } // Contains numbers for when occurrences are on specific number days of the month.
});
const changeSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  referenceId: { type: String, required: false }
});
const changeRequestSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  request: { type: String, required: true },
  referenceId: { type: String, required: false }
});

const budgetSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  lastChangedDate: { type: Date, default: Date.now },
  name: { type: String, required: true, min: 1},
  managers: {type: Array, required: true },
  viewers: {type: Array, required: false },
  income: {type: [incomeSchema], required: false },
  outgo: {type: [outgoSchema], required: false },
  changeHistory: { type: [changeSchema], required: false },
  requestedChanges: { type: [changeRequestSchema], required: false }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports.Budget = Budget;