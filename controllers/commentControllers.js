const Post = require('../models/post');
const Comment = require('../models/comment'); 
const User = require('../models/user');
// exports.commentForm = async (req,res)=>{
//     const post = await Post.findById(req.params.id);
//     res.render('newComment',{title:'Comment',post});
// }

exports.validateComment = (req,res,next)=>{
    req.checkBody('comment','Comment field cannot be empty').notEmpty();
    const error = req.validationErrors();
    if(error){
        req.flash('error',error.map(err=>err.msg));
        return res.redirect('back');
    }
    next();
}

exports.createComment = async (req,res)=>{
    //create the comment and add it to the databse
    const comment = new Comment(req.body);
    comment.author = req.user;
    await comment.save();
    //find the post related to the comment
    const post = await Post.findById(req.params.id);
    //add the comment to the comments array of the related post
    post.comments.push(comment);
    await post.save();
    //find the user that created the comment
    const user = await User.findById(req.user._id);
    //add the comment to the comments arry of the related user
    user.comments.push(comment);
    await user.save();
    req.flash('success','New comment has been created')
    res.redirect(`/posts/${post.slug}`);
}
