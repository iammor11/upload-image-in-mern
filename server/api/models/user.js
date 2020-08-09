const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    mblno: {
        type: Number
    },
    file: {
      //for multiple files  type: Array,
        type: String,
        required: true
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User;