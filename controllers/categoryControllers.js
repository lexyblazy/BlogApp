const Category = require('../models/category');

//get all the categories
exports.categories = async (req,res)=>{
    const categories = await Category.find({});
    res.render('categories',{title:'Categories',categories});
}
//render a form to add new category
exports.addForm = (req,res)=>{
    res.render('addcategory',{title:'Add category'})
}

exports.validateCategory = (req,res,next)=>{
    req.checkBody('name','Category name must be supplied').notEmpty();
    req.checkBody('description','Category description must be supplied').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('back');
    }
    next();
}
//save the category to the db
exports.create =  async (req,res)=>{
 const category = new Category(req.body);
 await category.save();
 req.flash('success','New category has been added')
 res.redirect('/categories');
}

//get a specific category
exports.getCategory = async (req,res)=>{
    const category = await Category.findOne({name:req.params.category}).populate('posts');
    const error = `${req.params.category} Category does not exist`
    if(!category){
        req.flash('error',error);
        return res.redirect('/categories')
    }
    res.render('categorypost',{title:`All posts belonging to ${category.name}`,category});
}