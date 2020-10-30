const mongoose = require('mongoose');
require('../db/db');
const UserSchema = mongoose.Schema({
    email:{type:String,required:true,trim:true},
    username:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    services:{type:String,required:true}
})
const User = mongoose.model('Users',UserSchema);
module.exports = User;