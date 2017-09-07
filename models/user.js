const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseErrors = require('mongoose-mongodb-errors');

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
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    resetPasswordToken:String,
    resetPasswordExpires:Date
})

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});
userSchema.plugin(mongooseErrors);

module.exports = mongoose.model('User',userSchema);