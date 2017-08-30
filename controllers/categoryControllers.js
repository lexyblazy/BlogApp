const Category = require('../models/category');


exports.categories = async (req,res)=>{
    const categories = await Category.find({});
    res.render('categories',{title:'Categories',categories});
}
exports.addForm = (req,res)=>{
    res.render('addcategory',{title:'Add category'})
}

exports.create =  async (req,res)=>{
 const category = new Category(req.body);
 await category.save();
 res.redirect('/categories');
}