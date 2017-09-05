const promisify = require('es6-promisify');
const User = require('../models/user')

//render the registerForm
exports.registerForm = (req,res)=>{
    res.render('register',{title:'Sign up'})
}

//validate the register Form
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
        req.flash('error',errors.map(err=>err.msg))
        return res.redirect('/register')
    }
    next();
}

//now save the user to the database
exports.register = async (req,res,next)=>{
    const user = new User({name:req.body.name,email:req.body.email});
    //use promisify to handle callback based API
    const register = promisify(User.register,User);
    await register(user,req.body.password);
    next();

}

//render the profile page
exports.profile = async (req,res)=>{
    const profileUser = await User.findById(req.params.id).populate('posts').populate('comments');
    if(!profileUser){
        req.flash('error','No such user exists');
        return res.redirect('/posts');
    }
    res.render('profile',{title:'Profile Page',profileUser});
}

exports.editProfileForm = async (req,res)=>{
    const profileUser = await User.findById(req.params.id);
    if(!profileUser){
        req.flash('error','No such user exists');
        return res.redirect('back');
    }
    res.render('editProfile',{title:'Edit your Profile',profileUser});
}

exports.updateProfile = async (req,res)=>{
    const updates = {
        name:req.body.name,
        email:req.body.email
    }
    const profileUser = await User.findByIdAndUpdate( req.user._id,{$set:updates},{
        new:true,
        runValidators:true,
        context:'query'
    });
     
    req.flash('success','Profile update was succesful');
    res.redirect('back');

}