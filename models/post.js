const mongoose = require('mongoose');
// const validator = require('validator')
mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:'Please supply a post title',
        trim:true
    },
    content:{
        type:String,
        required:'Post must have a content'
    },
    image:String,
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }
})

module.exports = mongoose.model('Post',postSchema);