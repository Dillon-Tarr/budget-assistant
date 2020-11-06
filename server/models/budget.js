const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  managers: {type: Array, required: true, unique: false },
  viewers: {type: Array, required: false, unique: false },
  income: {type: Array, required: false, unique: false },
  outgo: {type: Array, required: false, unique: false },
  lastChangedDate: { type: Date, required: false, unique: false},
  recentChanges: { type: Array, required: false, unique: false },
  requestedChanges: { type: Array, required: false, unique: false }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports.Budget = Budget;