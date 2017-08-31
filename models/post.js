const mongoose = require('mongoose');
const slug = require('slugs');
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
    slug:String,
    category:String,
    date:{
        type:Date,
        default:Date.now
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
  
})

postSchema.pre('save',function(next){
    if(!this.isModified('title')){
        return next();
    }
    this.slug = slug(this.title);
    next();
})
module.exports = mongoose.model('Post',postSchema);
