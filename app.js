//requiring inbuilt modules
const path = require('path');

//requring third party modules
const express = require('express');
const app = express();
const engine = require('ejs-mate');


//requiring self built modules
const routes = require('./routes/index')

//environmental variables config
require('dotenv').config({path:'variables.env'})

//public path and view engine setup
const publicPath = path.join(__dirname , '/public');
app.use(express.static(publicPath));
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');


//routes
app.use(routes);

app.listen(process.env.PORT,()=>{
    console.log('Server is up and running')
})