const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
const crypto = require('crypto');
const promisify = require('es6-promisify');
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

exports.forgot = async (req,res)=>{
    //check if that user has an account
    const user = await User.findOne({email:req.body.email});
    if(!user){
        req.flash('error','No account exists for that email');
        return res.redirect('back');
    }
    //generate a password reset token and expiry
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + (60*60*1000);
    await user.save();
    // //send them the reset url
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success',`Password reset url has been sent to your email ${resetURL}`);
    res.redirect('back');
}


exports.reset = async (req,res)=>{
    //find the user by their token and its validity
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user){
        req.flash('error','Password reset token is invalid or has expired');
        return res.redirect('/login');
    }

    res.render('resetForm',{title:'Reset Password'});
}

exports.confirmPasswords = (req,res,next)=>{
    req.checkBody('password','Password field cannot be empty').notEmpty();
    req.checkBody('confirm-password','Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',  errors.map(err=>err.msg));
        return res.redirect('back');
    }
    next(); //keep moving on if no errors
  
}

exports.setPassword = async (req,res)=>{
      //find the user by their token and its validity
      const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user){
        req.flash('error','Password reset token is invalid or has expired');
        return res.redirect('/login');
    }
    //promisify the user.setPassword
    const setPassword = promisify(user.setPassword,user);
    //set new password
    await setPassword(req.body.password);
    //remove the following fields
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    const updatedUser = await user.save();
    //promisify the req.login
    const login = promisify(req.login,req);
    await login(updatedUser);
    req.flash('success','password has been successfully updated, You are now logged in');
    res.redirect('/posts');

}

exports.validateLogin = (req,res,next)=>{
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('email','Email field cannot be empty').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    req.checkBody('password','Password field cannot be blank').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('/login');
    }
    next();
}

exports.validateForgotPassword = (req,res,next)=>{
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('email','Email field cannot be empty').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('/login');
    }
    next();
}