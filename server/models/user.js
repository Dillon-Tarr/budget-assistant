const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  loginName: { type: String, required: true, unique: true, minlength: 3, maxlength: 24 },
  displayName: { type: String, required: true, unique: false, minlength: 3, maxlength: 24 },
  password: { type: String, required: true, unique: false },
  emailAddress: { type: String, required: false },
  joinedDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
});

userSchema.methods.generateAuthToken = function(){
  return jwt.sign({ _id: this._id, loginName: this.loginName }, config.get('jwtSecret'), { expiresIn: "24h" });
};

const User = mongoose.model('User', userSchema);

module.exports.User = User;