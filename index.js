const session = require('express-session')
const express = require("express");
const app = express();
const morgan = require('morgan');

const datubase = require('./datubase.json');

const PORT = 4000;

app.use(morgan('dev'));
// use static files
app.use(express.static("public"));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use ejs views
app.set("view engine", "ejs");
app.set("views", "views");

const sess = {
    secret: 'ausazko hitz multzoa',
    cookie: {},
    resave: false,
    saveUninitialized: true
}
app.use(session(sess))

//username and password
/*
const myusername = 'user1'
const mypassword = 'mypassword'
*/

app.get('/',(req,res) => {

    if(req.session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else {
        res.redirect('form.html');
    }
});

app.post('/user',(req,res) => {
    /*
    if(req.body.username == myusername && req.body.password == mypassword){

        req.session.userid=req.body.username;
        console.log(req.session)
        res.redirect('/protected');
    }
    else{
        res.send('Invalid username or password');
    }
    */
    const { username, password } = req.body;

    const user = datubase.find(
      (user) => user.username === username && user.password === password
    );
  
    if (user) {
      req.session.userid = username;
      console.log(req.session);
      res.redirect('/');
    } else {
        res.redirect('form.html?error=true');
      //res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);})
