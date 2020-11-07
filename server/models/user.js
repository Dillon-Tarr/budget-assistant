const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const goalSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: false, minlength: 1, maxlength: 255 },
  isComplete: { type: Boolean, required: true, unique: false, default: false },
  estimatedCompletionDate: { type: Date, required: false, unique: false },
  completedDate: { type: Date, required: false, unique: false }
});

const userSchema = new mongoose.Schema({
  loginName: { type: String, required: true, unique: true, minlength: 3, maxlength: 24 },
  displayName: { type: String, required: true, unique: false, minlength: 3, maxlength: 24 },
  password: { type: String, required: true, unique: false },
  emailAddress: { type: String, required: false },
  goals: { type: [goalSchema], required: false, unique: false},
  joinedDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
});

userSchema.methods.generateAuthToken = function(){
  return jwt.sign({ _id: this._id, loginName: this.loginName }, config.get('jwtSecret'), { expiresIn: "24h" });
};

const User = mongoose.model('User', userSchema);

module.exports.User = User;