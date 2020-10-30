const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/iwpproject"
mongoose.connect(url,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connected')
})