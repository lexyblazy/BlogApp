//requiring inbuilt modules
const path = require('path');

//requring third party modules
const express = require('express');
const app = express();
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');
//tell mongoose to use es6 promises
mongoose.Promise = global.Promise;


//requiring self built modules
const routes = require('./routes/index');
const Category = require('./models/category');
const User = require('./models/user');


//environmental variables config
require('dotenv').config({path:'variables.env'})

//public path and view engine setup
const publicPath = path.join(__dirname , '/public');
app.use(express.static(publicPath));
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');

//connect to the database
mongoose.connect(process.env.DATABASE,(err)=>{
    if(err){
        console.log('Cannot connect to database')
    }else{
        console.log('connection to database was successful');
    }
});


//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//make the categories data available on all routes
app.use(async (req,res,next)=>{
    try {
        const categories = await Category.find({});
        res.locals.categories = categories;
    } catch (error) {
        console.log(error);
    }
    next();
})

app.use(expressValidator()); //exposes a bunch of methods to app

//passport setup
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//routes
app.use(routes);

//port
app.listen(process.env.PORT,()=>{
    console.log('Server is up and running')
})