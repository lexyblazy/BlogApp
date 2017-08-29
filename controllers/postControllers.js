const Post = require('../models/post');
exports.home = (req,res)=>{
    res.redirect('/posts')
}

exports.posts = async (req,res)=>{
    const posts = await Post.find({});
    res.render('posts',{title:'All Blog Posts',posts});
}

exports.newForm = (req,res)=>{
    res.render('new',{title:'Create a new Post'});
}

exports.createNew = async (req,res)=>{
    const post = new Post(req.body);
    await post.save();
    res.redirect('/posts');
}