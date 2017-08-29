exports.home = (req,res)=>{
    res.redirect('/posts')
}

exports.posts = (req,res)=>{
    res.render('posts',{title:'All Blog Posts'});
}

exports.newForm = (req,res)=>{
    res.render('new',{title:'Create a new Post'});
}

exports.createNew = (req,res)=>{
    res.json(req.body);
}