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

exports.getCategory = async (req,res)=>{
    const category = await Category.findOne({name:req.params.category}).populate('posts');
    if(!category){
        console.log('Category does not exist');
        return res.redirect('/categories')
    }
    res.render('categorypost',{title:`All posts belonging to ${category.name}`,category});
}