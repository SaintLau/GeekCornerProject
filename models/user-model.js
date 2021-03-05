const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true
  },
  
  imageUrl: String,

})

const User = mongoose.model('User',userSchema);
module.exports = User;