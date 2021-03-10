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
    type: String
  
  },
  googleId: String,
  email: {
    type: String,
  
    unique: true,
    trim: true
  },
  
  imageUrl: String,
  favoriteAnimes: []

})

const User = mongoose.model('User',userSchema);
module.exports = User;