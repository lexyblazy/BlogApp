const Post = require('../models/post');
const Category = require('../models/category');
const  User = require('../models/user');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOptions = {
    storage:multer.memoryStorage(),
    fileFilter(req,file,next){
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto){
            next(null,true);
        }else{
            next({message:'This file type is not supported'},false)
        }
    }
}
exports.home = (req,res)=>{
    res.redirect('/posts')
}

//get all posts from the database
exports.posts = async (req,res)=>{
    const posts = await Post.find({});
    res.render('posts',{title:'All Blog Posts',posts});
}

//render a create new post form
exports.newForm = (req,res)=>{
    res.render('new',{title:'Create a new Post'});
}

//handle file uploads
exports.upload = multer(multerOptions).single('image');

//resize the uploaded file
exports.resize = async (req,res,next)=>{
    //if no file keep going
    if(!req.file){
        return next();
    }
    const extension = req.file.mimetype.split('/')[1];
    //generate a new for the file
    req.body.image = `${uuid.v4()}.${extension}`;
    //read file from buffer
    const photo = await jimp.read(req.file.buffer);
    //resize the image
    await photo.resize(800,jimp.AUTO);
    //write the file to disk
    await photo.write(`./public/uploads/${req.body.image}`);
    next();
}

//validate the post form data
exports.validatePost = (req,res,next)=>{
    req.checkBody('title','Post title cannot be empty').notEmpty();
    req.checkBody('content','Post must have a content').notEmpty();
    if(req.body.category){
        req.checkBody('category','Post must belong to category').notEmpty();
    }
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('/posts/new');
    }
    next();
}
//create the new post and save it to the database
exports.createNew = async (req,res)=>{
    req.body.title = req.sanitize(req.body.title);
    req.body.content = req.sanitize(req.body.content);  // sanitize the content field
    const post = new Post(req.body);
    post.author = req.user;

    //find the category related to the post
    const category = await Category.findOne({name:req.body.category});
    post.category = category;
    //find the user that created the post
    const user = await User.findById(req.user.id);
    await post.save();

    await category.posts.push(post);
    await user.posts.push(post);
    await category.save();
    await user.save();
    res.redirect('/posts');
}

//show more info about a specific post
exports.show = async (req,res)=>{
    const post = await Post.findOne({slug:req.params.slug}).populate('comments');
    if(!post){
        req.flash('error','Cannot find the requested post');
        return res.redirect('/posts');
    }
    res.render('show',{title:post.title,post});
}

//render a form to edit a post
exports.editForm = async (req,res)=>{
    const post = await Post.findById(req.params.id)
    if(!post){
        console.log('Post does not exist');
        return res.redirect('/posts')
    }

    res.render('edit',{title:`Edit ${post.title}`,post});
}

//update and save the edited post to the db
exports.updatePost = async (req,res)=>{
    req.body.content = req.sanitize(req.body.content); // sanitize the content field
    const post = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).exec();
    res.redirect(`/posts/${post.slug}`);
}

//delete a post
exports.deletePost = async (req,res)=>{
    await Post.findByIdAndRemove(req.params.id);
    req.flash('success','Post has been successfully deleted');
    res.redirect('/posts');
}

//search for a post
exports.searchPosts = async (req,res)=>{
    const posts = await Post.find({
        $text:{
            $search: req.body.search
        }
    },{
        score:{$meta:'textScore'}
    }).sort({
        score:{$meta:'textScore'}
    }).limit(5).populate('category').populate('comments').populate('author');

    res.render('searchResults',{query:req.body.search,posts,title:`Search results for ${req.body.search}`})
}

exports.userPost = async (req,res)=>{
    const user = await User.findById(req.params.id).populate('posts');
    const posts = user.posts
    res.render('posts',{title:`${user.name} Posts`,posts})
} 