const promisify = require('es6-promisify');
const User = require('../models/user')
exports.registerForm = (req,res)=>{
    res.render('register',{title:'Sign up'})
}

exports.validateRegister = (req,res,next)=>{
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('password','Password field cannot be empty').notEmpty();
    req.checkBody('confirm-password','Passwords do not match').equals(req.body.password);
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extendsion:false,
        gmail_remove_subaddress:false
    })

    const errors = req.validationErrors();
    if(errors){
        console.log(errors);
        return res.redirect('/register')
    }
    next();
}

exports.register = async (req,res,)=>{
    const user = new User({name:req.body.name,email:req.body.email});
    //use promisify to handle callback based API
    const register = promisify(user.register,user);
    await register(user,req.body.password);

}