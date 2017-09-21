const Post = require('../models/post');
const Category = require('../models/category');
const  User = require('../models/user');
const cloudinary = require('cloudinary');


exports.home = (req,res)=>{
    res.redirect('/posts')
}

//get all posts from the database
exports.posts = async (req,res)=>{
    const page = req.params.page || 1;
    const limit = 4;
    const skip = (page * limit) - limit;
    const postsPromise = Post.find({}).limit(limit).skip(skip).sort({date:'desc'});
    const countPromise = Post.count();
    const [posts,count] = await Promise.all([postsPromise,countPromise]);
    const pages = Math.ceil(count/limit);
    if(posts.length === 0 && skip){
        req.flash('error','Page not found');
        res.redirect(`/posts/page/${pages}`)
    }
    res.render('posts',{title:'All Blog Posts',posts,page,pages,count});
}

//render a create new post form
exports.newForm = (req,res)=>{
    res.render('new',{title:'Create a new Post'});
}


//using cloudinary api
exports.upload = async (req,res,next)=>{
    if(req.files.image.name === ""){
        return next();
    }

    cloudinary.v2.uploader.upload(req.files.image.path, function(err,result) { 
        if(err){
            req.flash('error','Something went Wrong');
            return res.redirect('back');
        }
       req.body.image = result.url;
       next();
    });
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
    
    req.body.title = req.sanitize(req.body.title); //sanitize the title field
    req.body.content = req.sanitize(req.body.content);  // sanitize the content field
    const post = new Post(req.body);
    post.author = req.user;
    //find the category related to the post
    const category = await Category.findOne({name:req.body.category});
    post.category = category;
    //find the user that created the post
    const user = await User.findById(req.user.id);
    //save post to db
    await post.save();
    //add the post to the related category 
    await category.posts.push(post);
    //add the post to the user's post
    await user.posts.push(post);
    await category.save();
    await user.save();
    req.flash('success','New Post has been created')
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
    req.flash('success','Post has been updated');
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
    }).limit(10);

    res.render('searchResults',{query:req.body.search,posts,title:`Search results for ${req.body.search}`})
}

exports.userPost = async (req,res)=>{
    const user = await User.findById(req.params.id).populate('posts');
    const posts = user.posts;
    const page = null;
    res.render('posts',{title:`${user.name} Posts`,posts,page})
} 