const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const user = require('./model/user');
const complaint = require('./model/complaint');
const feed = require('./model/feedback');
ObjectId = require('mongodb').ObjectID;
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.resolve('../')));
require('./db/db');
app.listen(3000,function(){
    console.log('Server Started');
})

app.get('/',function(req,res){
   res.sendFile('index.html');
});
app.get('/getDetails/:username',async function(req,res){
   await user.findOne({username:req.params.username},function(err,resu){
     if(err){
       res.send(err);
     }
     else{
       res.json(resu);
     }
   })
});
app.post('/signup',async function(req,res){
    console.log(req.body);
    const userid = new user(req.body);
    try{
        userid.save(function(err){
        if(err){ 
         res.send(err);
        }else{
          console.log("success");
          res.send('Success!Account Created');
        }
      });
    }
    catch(e){
        res.send(e);
    }   
});
app.get('/logout',function(req,res){
    res.clearCookie('user');
    res.redirect('/');
})
app.get('/services/:service',async function(req,res){
  await user.find({services:req.params.service},function(err,resu){
        if(err){
          res.send(err);
        }
        else{
          res.json(resu);
        }
  });
})
app.get('/resolve/:id',async function(req,res){

    await complaint.findOneAndUpdate({_id:req.params.id}, { resolved: true }, async function(err, result) {
    if (err) {
      res.send(err);
    } else {
      await user.findOne({username:result.username},function(err,resu){
        if(err){
          console.log('Unable to send mail')
        }
        else{
          console.log(resu.email);
          console.log(result.target);
      fetch('https://flaskemailjai.herokuapp.com/resolved/'+resu.email+'/'+result.target)
              .then(res => console.log(res.status)).catch(err=> console.log(err));
            res.send('Done');
            }
    });
  }
}
    );});
app.get('/reopen/:id',async function(req,res){
      complaint.findOneAndUpdate({_id:req.params.id}, { resolved: false}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
          
}})});
app.get('/delete/:id',async function(req,res){
      complaint.findOneAndDelete({_id:req.params.id}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
}})});

app.get('/complaints/:username',async function(req,res){
    complaint.find({target: req.params.username}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
})
app.get('/compme/:username',async function(req,res){
    complaint.find({username: req.params.username}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
})
app.post('/make',async function(req,res){
    console.log(req.body);
    await complaint.findOne({target:req.body.target,username:req.body.username},function(err,resu){
          if(err){
            res.send(err);
          }
          else{
            if(resu==null){
              var targetuser = req.body.target;
    const compid = new complaint(req.body);
    try{
        compid.save( async function(err){
        if(err){ 
         res.send(err);
        }else{
          console.log("success");
          console.log(targetuser);
          await user.findOne({username: targetuser}, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result)
              if(result == null){
                res.send('Enter a valid Target');
              }
              else{
              res.send('Success!Complaint Registered');
              fetch('https://flaskemailjai.herokuapp.com/compmail/'+result.email+'/'+req.body.username)
              .then(res => console.log(res.status)).catch(err=> console.log(err));
            }}
          }); 
        }
      });
    }
    catch(e){
        res.send(e);
    }   
            }
else{
  res.send('Complaint Already Exists!');
}
      
          }

    });
    

});
app.post('/login',function(req,res){
    console.log(req.body)
    user.findOne({username:req.body.username}).then((user)=>{
        const userdata = user;
        console.log(userdata);
        if(userdata==null){
            res.send('No user with that username password combination!');
        }
        else{
                   if(userdata.password==req.body.password){//logged in
                      res.cookie('user',userdata.username,{maxAge:10000000,httpOnly:false});
                      res.redirect('/home.html');
                   }
                   else{ //login failed
                    res.send('No user with that email password combination!');
                   }
               }});
            });
app.post('/feedback/:username1/:username2',async function(req,res){
  const feedb = new feed(req.body);
  console.log(req.body);
  await feed.findOne({madeby:req.params.username2 , username:req.params.username1},function(err,resu){
    if(err){
      res.send(err);
    }
    else{
      console.log(resu)
      if(resu==null){
  try{
      feedb.save(function(err){
      if(err){ 
       res.send(err);
      }else{
        res.send('Success!Feedback Posted!');
      }
    });
  }
  catch(e){
      res.send(e);
  }    
}
else{
  res.send('Feedback Exists');
}}});
});

app.get('/feedbackdel/:username1/:username2',async function(req,res){
  const feedb = new feed(req.body);
  console.log(req.body);
  await feed.findOneAndDelete({madeby:req.params.username2 , username:req.params.username1},function(err,resu){
    if(err){
      res.send(err);
    }
    else{
      console.log(resu)
      if(resu==null){
         res.send('No such Feedback Exists!')  
}
else{
  res.send('Deleted!');
}}});
});
app.get('/rating/:username',async function(req,res){
     var getAvg=0;
     var total= 0;
    (await feed.find({username:req.params.username})).forEach(function(elem){
          getAvg = getAvg + parseInt(elem.rating);
          total = total + 1 ;
    });
    console.log(getAvg);
    console.log(total);
    getAvg = parseFloat(getAvg/total);
    console.log(getAvg);
    var json = {"rating":getAvg};
    res.json(json);
});    

