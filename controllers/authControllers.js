const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');

//the login middleware
exports.login = passport.authenticate('local',{
    successRedirect:'/posts',
    successFlash:'You are now logged in',
    failureRedirect:'/login',
    failureFlash:'Email/Password Mismatch'
})

//render the loginForm
exports.loginForm = (req,res)=>{
    res.render('login',{title:'Login to your account'});
}

//logout middleware
exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','You have been sucessfully logged out');
    res.redirect('/posts');
}

//verify whether a user is logged in
exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','You have to be logged in to do that');
    res.redirect('/login')
}
//verify whether a user owns a post
exports.checkPostOwnership = async (req,res,next) =>{
    const post = await Post.findById(req.params.id).populate('author');
    if(req.user._id.equals(post.author._id)){
        return next();
    }
    req.flash('error','You dont have permission to do that');
    res.redirect(`/posts/${post.slug}`);
   
}

exports.checkProfileOwnership = async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(req.user._id.equals(user._id)){
        return next();
    };
    req.flash('error','You are not authorized to do that');
    res.redirect(`/profile/${user._id}`);
   
}

