const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        validate:[validator.isEmail,'Enter a valid email'],
        trim:true,
        unique:true
    },
    name:{
        type:String,
        trim:true,
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]
})

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});
module.exports = mongoose.model('User',userSchema);