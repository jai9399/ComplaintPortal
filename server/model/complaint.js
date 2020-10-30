const mongoose = require('mongoose');
require('../db/db');
const CompSchema = mongoose.Schema({
    username:{type:String,required:true,ref:"users"},
    text:{type:String,required:true},
    target:{type:String,required:true},
    resolved:{type:Boolean,default:false}
})
const Complaint = mongoose.model('complaints',CompSchema);
module.exports = Complaint;