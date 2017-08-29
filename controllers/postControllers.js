const Post = require('../models/post');
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

exports.posts = async (req,res)=>{
    const posts = await Post.find({});
    res.render('posts',{title:'All Blog Posts',posts});
}

exports.newForm = (req,res)=>{
    res.render('new',{title:'Create a new Post'});
}

exports.upload = multer(multerOptions).single('image');

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

exports.createNew = async (req,res)=>{
    const post = new Post(req.body);
    await post.save();
    res.redirect('/posts');
}