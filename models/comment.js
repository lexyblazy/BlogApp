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
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

function autopopulate(next){
    this.populate('author'),
    next();
}

commentSchema.pre('find',autopopulate);
commentSchema.pre('findOne',autopopulate);

module.exports = mongoose.model('Comment',commentSchema);