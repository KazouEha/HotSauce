const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//user schema for mongoose, we use unique validator to verify that the email is not already on another account
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);