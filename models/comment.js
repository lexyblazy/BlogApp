const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:'Comment field cannot be empty',
        trim:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Comment',commentSchema);