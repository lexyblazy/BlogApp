const passport = require('passport');
exports.login = passport.authenticate('local',{
    successRedirect:'/posts',
    successFlash:'You are now logged in',
    failureRedirect:'/login',
    failureFlash:'Email/Password Mismatch'
})