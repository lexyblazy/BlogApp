const passport = require('passport');
exports.login = passport.authenticate('local',{
    successRedirect:'/posts',
    successFlash:'You are now logged in',
    failureRedirect:'/login',
    failureFlash:'Email/Password Mismatch'
})

exports.loginForm = (req,res)=>{
    res.render('login',{title:'Login to your account'});
}
exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','You have been sucessfully logged out');
    res.redirect('/posts');
}

exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','You have to be logged in to do that');
    res.redirect('/login')
}