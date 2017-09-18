const mongoose = require('mongoose');
const slug = require('slugs');
// const validator = require('validator')
mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:'Please supply a post title',
        unique:'A post with that title already exists',
        trim:true,
    },
    content:{
        type:String,
        required:'Post must have a content'
    },
    image:String,
    slug:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
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
  
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

function autopopulate(next){
    this.populate('category');
    this.populate('author');
    next();
}

postSchema.pre('find',autopopulate);
postSchema.pre('findOne',autopopulate);
postSchema.index({
    title:'text',
    content:'text'
})

postSchema.pre('save',async function(next){
    if(!this.isModified('title')){
        return next();
    }
this.slug = slug(this.title);
  next();
})

module.exports = mongoose.model('Post',postSchema);
