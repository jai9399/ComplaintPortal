var maindiv;
var username;
var details;
var isCustomer=false;
var imagediv = document.getElementById("image");
$(document).ready(async function(){
    check();
    await $.get( "/getDetails/"+username, function( data ) {
        console.log(data);
        if(data.services == "Customer"){
            isCustomer= true;
        }
    }).fail(function(){
        console.log('Error');
    });
    maindiv = document.getElementById("section");
})
    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else
        {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
        }
        // because unescape has been deprecated, replaced with decodeURI
        //return unescape(dc.substring(begin + prefix.length, end));
        return decodeURI(dc.substring(begin + prefix.length, end));
    } 
   function updateComplaint(id){
    if (confirm("Resolve Complaint?")) {
        console.log(id);
        $.get( "/resolve/"+id, function( data ) {
            console.log(data);
            alert('Resolved!');
        }).fail(function(){
            console.log('Error');
        });
    } 
      else {
        console.log('Cancelled!');
      }
   }
   function removeComplaint(id){
    if (confirm("Delete Complaint?")) {
        console.log(id);
        $.get( "/delete/"+id, function( data ) {
            console.log(data);
            alert('Deleted!');
        }).fail(function(){
            console.log('Error');
        });
    } 
      else {
        console.log('Cancelled!');
      }
   }
   function reopenComplaint(id){
    if (confirm("Reopen Complaint?")) {
        console.log(id);
        $.get( "/reopen/"+id, function( data ) {
            console.log(data);
            alert('Reopened!');
        }).fail(function(){
            console.log('Error');
        });
    } 
      else {
        console.log('Cancelled!');
      }
   }
   function getServices(){
       if(!isCustomer){
           maindiv.innerHTML = "Must be a Customer to Access this!";
       }
       else{
       maindiv.innerHTML = `
        <div>
        <select name="serve" id="serve">
        <option value="Electrical">Electrical</option>
        <option value="Water">Water</option>
        </select>
        <button id="submit" onclick="callService()">Get!</button>
        </div>
       `;}
   }
   function makeFeed(val){
    maindiv.innerHTML = `
       <div style="background-color:#003542;padding:20px;">
        <h5>Feedback:-<h5>
        <form action= "/feedback/${val}/${username}" method="Post" style="display:flex;flex-direction:column">
        <h6 style="margin-top:20px;">Rating<h6>
        <select name="rating" id="rating">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select>
        <h6>Comments<h6>
        <textarea></textarea><br>
        <input type="hidden" name="username" value="${val}">
        <input type="hidden" name="madeby" value="${username}">
        <button id="submit" style="width:100px; margin-top:30px">Post!</button>
        </form>
    <div>
    `;
    }
   function callService(){
       var x = document.getElementById('serve').value;
       maindiv.innerHTML = "";
       $.get( "/services/"+x, async function( data ) {
        data.forEach(async function(num){
            var text = num.username;
            var email = num.email;
            var rating;
            await $.get("/rating/"+text,function(data){
              console.log(data.rating);
              rating = data.rating;
              if(rating == null){
                  rating = "Not rated";
              }
            });
            var temp = `
            <div id="comp" >
               <p>Username :- ${text}</p>
               <p>Email :- ${email}</p>
               <p>Rating :- ${rating}</p>
               <div style="display:flex">
                   <button><a href="https://flaskemailjai.herokuapp.com/serviceRequested/${email}/${username}" style="color:black;">Request Service<a></button>
                   <button onclick="makeFeed('${text}')">Post Feedback</button>
                   <button><a href="/feedbackdel/${text}/${username}" style="color:black;">Delete Feedback</a></button>
               </div>
            </div>
   
            `;
            maindiv.innerHTML = maindiv.innerHTML+temp;
        })
      }).fail(function() {
        maindiv.innerHTML="There was some Error";
      });
   }
 
    function showMine(){
        maindiv.style.alignSelf="flex-start";
        maindiv.style.marginTop= "100px";
        imagediv.style.height = "100vh";
        maindiv.innerHTML="Complaints:- <br>";
        $.get( "/compme/"+username, function( data ) {
            data.forEach((num)=>{
                console.log(num);
                var text = num.text;
                var target = num.target;
                var resolved = num.resolved;
                var id = num._id;
                var temp = `
                <div id="comp" >
                   <p>Complaint Desc :- ${text}</p>
                   <p>Target :- ${target}</p>
                   <p>Resolved? :- ${resolved}</p>
                   <div style="display:flex">
                       <button onclick="reopenComplaint('${id}')">Reopen?</button>
                       <button onclick="removeComplaint('${id}')">Delete?</button>
                   </div>
                </div>
       
                `;
                maindiv.innerHTML = maindiv.innerHTML+temp;
            })
          }).fail(function() {
            maindiv.innerHTML="There was some Error";
          });
    }
    function getMine(){
        maindiv.style.alignSelf="flex-start";
        maindiv.style.marginTop= "100px";
        imagediv.style.height = "100vh";
        maindiv.innerHTML="Complaints:- <br>";
        $.get( "/complaints/"+username, function( data ) {
            data.forEach((num)=>{
                console.log(num);
                var text = num.text;
                var user = num.username;
                var resolved = num.resolved;
                var id = num._id;
                var temp = `
                <div id="comp" >
                   <p>Complaint Desc :- ${text}</p>
                   <p>Made By :- ${user}</p>
                   <p>Resolved? :- ${resolved}</p>
                   <div style="display:flex">
                       <button onclick="updateComplaint('${id}')">Resolved?</button>
                   </div>
                </div>
       
                `;
                maindiv.innerHTML = maindiv.innerHTML+temp;
            })
          }).fail(function() {
            maindiv.innerHTML="There was some Error";
          });
    }
    function make(){
        maindiv.style.alignSelf="flex-start";
        maindiv.style.marginTop= "100px";
        imagediv.style.height = "100vh";
        maindiv.innerHTML =`<div style="text-align: center; background-color: #003542;" >
        <h1 id="heading">Complaint</h1>
        <form action="/make" method="POST" id="form1" style="padding:100px;">
            <h2>Target</h2>
            <input type="text" name="target" class="sty">
            <br>
            <br>
            <h2>Description</h2>
            <input type="text" name="text" class="sty">
            <br>
            <br>
            <h2>Username</h2>
            <input type="hidden"  name="username" value="${username}" class="sty disable">
        </form>
        <input type="submit" id="button" form="form1">
    </div>`
    }
    function check(){
       var span = document.getElementById('name');
       span.innerHTML = getCookie("user");
       username = getCookie("user");
       console.log(span.innerHTML);
    }
    function logout(){
        $.get("/logout", function(data, status){
            console.log("Logged out");
            window.location.pathname= "/";
          });
       
    }