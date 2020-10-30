const mongoose = require('mongoose');
require('../db/db');
const UserSchema = mongoose.Schema({
    username:{type:String,required:true,trim:true},
    rating:{type: String,required:true,trim:true},
    madeby:{type:String,required:true,trim:true}
})
const Feed = mongoose.model('Feedback',UserSchema);
module.exports = Feed;