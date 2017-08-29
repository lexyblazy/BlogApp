const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true
    }
})

module.exports = mongoose.model('Category',categorySchema);