const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:'You must supply a category name'
    },
    description:{
        type:String,
        trim:true,
        required:'You must enter a description'
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

module.exports = mongoose.model('Category',categorySchema);