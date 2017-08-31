const Post = require('../models/post');
const Comment = require('../models/comment'); 
exports.commentForm = async (req,res)=>{
    const post = await Post.findById(req.params.id);
    res.render('newComment',{title:'Comment',post});
}