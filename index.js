
async function main(){
  const express = require('express');
  const bodyParser = require('body-parser')
  const app = express();
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())
  function repd(){
  var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;
             return today
            }

function calcstart(endTimeString, durationObject) {
  // Parse the end time string without date
  const endTime = new Date(`1970-01-01T${endTimeString}`);

  // Convert duration to milliseconds
  const durationMilliseconds =
    durationObject.h * 60 * 60 * 1000 +
    durationObject.m * 60 * 1000 +
    durationObject.s * 1000;

  // Calculate start time by subtracting duration
  const startTime = new Date(endTime.getTime() - durationMilliseconds);

  // Format start time as ISO string without date
  const startTimeString = startTime.toISOString().substr(11, 8);

  return startTimeString;
}

let pages = {}
pages.home=`
<style>
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Inter:wght@300&family=Work+Sans:wght@400;500&display=swap');
  body, div, h1, input, button {
    
    font-family:'Inter', sans-serif;
  }
  /* body {
    background-color: #f2f2f2;
  } */
  #main {
    padding: 20px;
    background-color: white;
    text-align: left;
    border-radius: 20px;
    border: 2px solid black;
    margin: 0 auto; /* Add this to center the div horizontally */
  }
  input{
    padding:5px;
    border-radius: 5px;
    border:1px solid black;
    margin:3px;
  }
  button {
    border:2px solid black;
    border-radius:5px;
    background-color:white;
    padding:5px;
  }
</style>
<div id='header' style='left:0px;top:0px;height:40px;width:100%;background-color:white;display:flex;margin:0px;margin-bottom:20px;padding:5px;'>
  <div style='text-align:left;flex:1'><img src='https://i.ibb.co/BPrcDJX/download.png' style='height:40px;width:40px;'></div>
  <div style='text-align:left;flex:99999;font-size:35px;'><b>RICHCODE</b> DEVHUB</div> 
</div> 
<div id='cont' style='text-align:center;width:100%;height:100vmax;background-color:#f2f2f2'>

  <!-- </div> -->
  <br>
  <div id='main' class='main' style='padding:20px;background-color:white;text-align:left;width:50%;border-radius:20px;border:2px solid black'>
  <div id='signin' style='width:fit-content'>
    <h1>Sign in</h1>
    <form action="/" method="post">
        <label for="username">Email:</label>
        <input type="text" id="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Go →</button>
    </form>
    </div>
    <div id='signup' style='width:fit-content'>
    <h1>Sign up</h1>
    <form action="/" method="post">
      <label for="upusername">Email:</label>
      <input type="text" id="upemail" name="upemail" required>
      <br>
      <label for="uppassword">Password:</label>
      <input type="password" id="uppassword" name="uppassword" required><br>
      <label for="upname">Full Name:</label>
      <input type="text" id="upname" name="upname" required><br>
      <label for="admin">Admin Password:</label>
      <input type="password" id="admin" name="admin" required>
      <br>
      <button type="submit">Go →</button>
    </form>
    </div>
  </div>
</div>
  `
pages.default =   `

` 

function gendate(){
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  return {year:year, day:day, month:month}
}


const axios = require('axios');
const crypto = require('crypto');

const jsonBinUrl = 'https://api.jsonbin.io/v3/b/657d155d266cfc3fde697367';
const secretKey = process.env['jsonbin']; // Optional, only if you want to update or delete


function hash(inputString) {
    // Retrieve the secret key from process.env
    const secretKey = process.env['salt'];

    // Check if the secret key is present
    if (!secretKey) {
        throw new Error('Secret key is missing from environment variables.');
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(inputString);
    return hmac.digest('hex');
}



let sessions={};

function setmid(callback) {
  // Get the current date and time
  const now = new Date();

  // Calculate the time until midnight
  const timeUntilMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // Advance to the next day
    0, 0, 0, 0 // Set to midnight
  ) - now;

  // Set an interval to run the function every midnight
  setInterval(callback, timeUntilMidnight);
}

setmid(() => {
  sessions={}
})


function gensessionid() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
  const stringLength = 32;

  let randomString = '';
  for (let i = 0; i < stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  if(sessions[randomString]){
    return gensessionid()
  } else {
    return randomString;
  }
}

async function get() {
  const response = await axios.get(`${jsonBinUrl}/latest`, {headers: { 'X-Master-Key':process.env['jsonbin']}});
  return response.data;
}

// Update and Delete operations are optional and require the secret key
async function set(data) {
  if(typeof data=='object'){
    data=JSON.stringify(data)
  }
  const response = await axios.put(`${jsonBinUrl}`, data, {
    headers: { 'X-Master-Key': secretKey, 'Content-Type':'application/json' },
  });
  return response.data;
}

  //test
  let content = await get();
  let data = content.record;
  console.log(content)


  let signinpage = pages.home
  app.get('/', (req, res) => {
    res.send(signinpage)  
  })
  app.post('/', async (req, res) => {
    if(req.body.email && req.body.password){
      // console.log(req.body)
      let email = req.body.email;
      let password = req.body.password;
      let data = await get();
      data = data.record;
      if(data.users[email]){
        console.log(data.users[email].password, hash(password))
        if(data.users[email].password == hash(password)){
          let sessionid = gensessionid();
          sessions[sessionid] = email;
          res.redirect('/dash/u/'+sessionid);
        } else {
          res.send(`${signinpage}
          <script>window.alert('Invalid Credentials')</script>
          `);
        }
      } else {
        res.send(`${signinpage}
          <script>window.alert('User not found. Try signing up instead. ')</script>
        `);
      }
    } else if (req.body.upemail){
      let email = req.body.upemail;
      let password = req.body.uppassword;
      let name = req.body.upname;
      let data = await get();
      let record = data.record;
      let givenadmin=req.body.admin;
      if(hash(givenadmin)!==process.env['hashedadmin']){
        res.send(`${signinpage}
          <script>window.alert('Invalid Admin Password. Please contact admins if you do not know the password')</script>
        `);
      }
      if(record.users[email]){
        res.send(`${signinpage}
          <script>window.alert('Email already exists. Try signing in instead. ')</script>
        `);
      } else {
        let sessionid = gensessionid();
        sessions[sessionid] = email;
        let datetoday = gendate()
        record.users[email] = {
          password: hash(password),
          name: name,
          email: email,
          data: {
            "total": {
              "h": 0,
              "m": 0
            },
            "today": {
              "h": 0,
              "m": 0
            },
            "date": {
              "y": datetoday.year,
              "m": datetoday.month,
              "d": datetoday.day
            }
          }
        }
        await set(record);
        res.redirect('/dash/u/'+sessionid);
      }
        
    } else {
      res.send(signinpage = "<script>window.alert('Please fill out all required fields')</script>")
    }
  })
  
  app.get('/dash/u/:sessionid', async (req, res) => {
    let sessionid = req.params.sessionid;
    let userkey = sessionid
    if(sessions[sessionid]){
      let email = sessions[sessionid];
      let data = await get()
      data = data.record;
      let name = data.users[email].name;
      
      
      res.send(`
      <style>
       @import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Inter:wght@300&family=Work+Sans:wght@400;500&display=swap');
        body, div, h1, input, button {

          font-family:'Inter', sans-serif;
        }
        /* body {
          background-color: #f2f2f2;
        } */
        #main {
          padding: 20px;
          background-color: white;
          text-align: left;
          border-radius: 20px;
          border: 2px solid black;
          margin: 0 auto; /* Add this to center the div horizontally */
        }
        input{
          padding:5px;
          border-radius: 5px;
          border:1px solid black;
          margin:3px;
        }
        button {
          border:2px solid black;
          border-radius:5px;
          background-color:white;
          padding:5px;
        }
        .h2s {
          width:40px;
          text-align:center;
        }
      </style>
      <div id='header' style='left:0px;top:0px;height:40px;width:100%;background-color:white;display:flex;margin:0px;margin-bottom:20px;padding:5px;'>
        <div style='text-align:left;flex:1'><img src='https://i.ibb.co/BPrcDJX/download.png' style='height:40px;width:40px;'></div>
        <div style='text-align:left;flex:99999;font-size:35px;'><b>RICHCODE</b> DEVHUB</div> 
      </div> 
      <div id='cont' style='text-align:center;width:100%;height:100vmax;'>
        <div id='account'>Welcome ${name} (${email}). To change your login info, please contact admins. </div>

        <div id='main' class='main' style='padding:20px;background-color:white;text-align:left;width:50%;border-radius:20px;border:2px solid black'>

        <div id='entertime'>
          <h2>Enter time to log:</h2>
          <form method='post' action='/recordtime/u/${userkey}'>
          <label for='project'>Project:</label><input type='text' name='project'><br>
            <input class='h2s' type='text' name='h' placeholder='HH' required>:<input class='h2s' type='text' name='m' placeholder='MM' required>:<input class='h2s' type='text' name='s' placeholder='SS' required>
            <button type='submit'>Enter log</button>
          </form>
        </div>
        <div id='recordtime'>
          <h2>Log Timer:</h2>
          
          <form method='post' action='/recordtime/u/${userkey}'>
          <input id='startdate' style='display:none'>
          <label for='project'>Project:</label><input type='text' name='project'><br>
          <input id = 'timerh' class='h2s' type='text' name='h2' placeholder='HH' value ='0' readonly>:<input class='h2s' type='text' name='m2' placeholder='MM' id = 'timerm' value ='0' readonly>:<input class='h2s' type='text' name='s2' placeholder='SS' id = 'timers' value ='0' readonly><br>
          <button type="button" onclick='starttimer()'>Start Timer</button>
          <button type="button" onclick='pausetimer()'>Pause Timer</button>
            <button type="button" onclick='resettimer()'>Reset Timer</button><br>
            <button type='submit'>End Timer and Log Time</button>
            </form>
          </form>
        </div>
      </div>
      <script>
        function calcdiff(previousDate) {
          // Get the current date and time
          const currentDate = new Date();

          // Calculate the time difference in milliseconds
          const timeDifference = currentDate - previousDate;

          // Convert milliseconds to hours, minutes, and seconds
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          // Return the result in the specified format
          return { h: hours, m: minutes, s: seconds };
        }
        var startdate=''
        var interval = ''
        var baseh = 0
        var basem = 0
        var bases = 0
        var timerstarted = false
      function starttimer(){
        if(!startdate){
          startdate=new Date()
        }
        
        const options = {
          hour12: false, // Use 24-hour format
          timeZoneName: 'short', // Display the short timezone name
          hour: 'numeric',
          minute: 'numeric'
        };
        document.getElementById('startdate').value = startdate.toLocaleTimeString('en-US', options);
        
        timerstarted=true
        
        let hoursi=document.getElementById('timerh')
        let minsi=document.getElementById('timerm')
        let seci=document.getElementById('timers')
        hoursi.value=baseh
        minsi.value=basem
        seci.value=bases
        interval=setInterval(function(){
          let hoursi=document.getElementById('timerh')
          let minsi=document.getElementById('timerm')
          let seci=document.getElementById('timers')
          let diff=calcdiff(startdate)
          if(bases+diff.s>59){
            diff.s=(bases+diff.s>59)%60
            diff.m++
          }
          if(basem+diff.m>59){
            diff.m=(basem+diff.m>59)%60
            diff.h++
          }
          hoursi.value=baseh+diff.h
          minsi.value=basem+diff.m
          seci.value=bases+diff.s
        }, 500)

      }
      function pausetimer() {
        if(!timerstarted){
          console.log(':(')
          return;
        }
        timerstarted=false;
        clearInterval(interval)
        let hoursi=document.getElementById('timerh')
        let minsi=document.getElementById('timerm')
        let seci=document.getElementById('timers')
        let diff=calcdiff(startdate)
        hoursi.value=diff.h+baseh
        minsi.value=diff.m+basem
        seci.value=diff.s+bases
        baseh=diff.h+baseh
        basem=diff.m+basem
        bases=diff.s+bases
        console.log(baseh, basem, bases)
      }
        function resettimer(){
          if(window.confirm('Reset Timer?')){
            pausetimer()
            baseh=0
            basem=0
            bases=0
            timerstarted=false;
            let hoursi=document.getElementById('timerh')
            let minsi=document.getElementById('timerm')
            let seci=document.getElementById('timers')
            hoursi.value=0
            minsi.value=0
            seci.value=0
          }

        }
        window.addEventListener('beforeunload', function (e) {
          let hoursi=document.getElementById('timerh')
          let minsi=document.getElementById('timerm')
          let seci=document.getElementById('timers')
          if(hoursi.value||minsi.value||seci.value){
            e.preventDefault();

          }
            e.returnValue = '';
        });

      </script>

      
      `)
    } else {
      res.redirect('/')
    }
  })
  app.post('/recordtime/u/:userkey', async (req, res)=>{
    let project = req.body.project
    if(!project){
      project=''
    }
    let userkey = req.params.userkey;
    if(!sessions[userkey]){
      res.redirect('/')
    }
    let data = await get()
    data = data.record;
    data = data.users
    let startdate=req.body.startdate
    if(!startdate){
      const options = {
        hour12: false, // Use 24-hour format
        timeZoneName: 'short', // Display the short timezone name
        hour: 'numeric',
        minute: 'numeric'
      };
      
      startdate=new Date()
      startdate=startdate.toLocaleTimeString('en-US', options);
    }
    // let name = data.users[userkey].name;
    
    let email = sessions[userkey];

    // if(data[email].logs[date[0]]){
    //   data[email].logs[date]
    // } else {
    //   data[email].logs[date] = [{start:startdate, project:project, duration:{h:req.body.h, m:req.body.m, s:req.body.s}}]
    // }
    data[email].data.total.h+=parseInt(req.body.h)
    if(parseInt(req.body.m)+data[email].data.total.m>=60){
      data[email].data.total.h++
      data[email].data.total.m=(parseInt(req.body.m)+data[email].data.total.m)%60
    }
    if(!data[email].logs){
    data[email].logs={}  
    }
    if(!data[email].logs[repd()]){
      data[email].logs[repd()]=[]
    }
    data[email].logs[repd()].push({
    starttime:startdate,
    project:project,
    duration:{h:req.body.h, m:req.body.m, s:req.body.s}
    })
    set({users:data})
    res.send(`
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Inter:wght@300&family=Work+Sans:wght@400;500&display=swap');
      body, div, h1, input, button {

        font-family:'Inter', sans-serif;
      }
      /* body {
        background-color: #f2f2f2;
      } */
      #main {
        padding: 20px;
        background-color: white;
        text-align: left;
        border-radius: 20px;
        border: 2px solid black;
        margin: 0 auto; /* Add this to center the div horizontally */
      }
      input{
        padding:5px;
        border-radius: 5px;
        border:1px solid black;
        margin:3px;
      }
      button {
        border:2px solid black;
        border-radius:5px;
        background-color:white;
        padding:5px;
      }
    </style>
    <div id='header' style='left:0px;top:0px;height:40px;width:100%;background-color:white;display:flex;margin:0px;margin-bottom:20px;padding:5px;'>
      <div style='text-align:left;flex:1'><img src='https://i.ibb.co/BPrcDJX/download.png' style='height:40px;width:40px;'></div>
      <div style='text-align:left;flex:99999;font-size:35px;'><b>RICHCODE</b> DEVHUB</div> 
    </div> 


    <br>

    <h1>Action done. <a href='/dash/u/${userkey}'>Return to dashboard</a></h1>
    
    `)
    
  })
  // let d = await get()
  // console.log(d)
  //   d.record.users["hermanboxcar5@gmail.com"].password='3904262d1e6b45c7be893e99b6dd3a2d9071de251812399c0f99a3802b4cbb6d'
  // await set(d.record)

  app.listen(3000, () => console.log('server started'));
}
main()



