exports.home = (req,res)=>{
    res.redirect('/posts')
}

exports.posts = (req,res)=>{
    res.render('posts',{title:'All Blog Posts'});
}