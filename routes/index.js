const router = require('express').Router();
const authController = require('../controllers/authControllers');
const postController = require('../controllers/postControllers');
const categoryController = require('../controllers/categoryControllers');
const userController = require('../controllers/userControllers');
const commentController = require('../controllers/commentControllers');
const {catchErrors} = require('../handlers/errorhandlers');
const multipartMiddleware = require('connect-multiparty')();

//============
//POSTS ROUTES
//============
router.get('/',postController.home);
//view all blog posts
router.get('/posts',postController.posts);
//view posts by pages
router.get('/posts/page/:page',postController.posts);
//render a form to create a new post
router.get('/posts/new',authController.isLoggedIn,postController.newForm);
//save the post to the database
router.post('/posts',
            authController.isLoggedIn,
            multipartMiddleware,
            catchErrors(postController.upload),
            postController.validatePost,
            catchErrors(postController.createNew)
        );
//show more info about a specific post
router.get('/posts/:slug',postController.show);
//render a form to edit a post
router.get('/posts/:id/edit',
            authController.isLoggedIn,
            catchErrors(authController.checkPostOwnership),
            postController.editForm
        );
//update and save post the the db
router.post('/posts/:id',
            authController.isLoggedIn,
            catchErrors(authController.checkPostOwnership),
            multipartMiddleware,
            catchErrors(postController.upload),
            postController.validatePost,
            catchErrors(postController.updatePost)
        )
//delete a post
router.post('/posts/:id/delete',
            catchErrors(authController.checkPostOwnership),
            catchErrors(postController.deletePost)
        )

//=================
//CATEGORIES ROUTES
//=================

//show all categories
router.get('/categories',categoryController.categories);
//create a new category form
router.get('/categories/new',authController.isLoggedIn,categoryController.addForm);
//save the category to DB
router.post('/categories',categoryController.validateCategory,catchErrors(categoryController.create));
//get a specific category
router.get('/categories/:category',catchErrors(categoryController.getCategory));

//===========
//USER ROUTES
//===========

//render a register form
router.get('/register',userController.registerForm);
//register the user then log them in
router.post('/register',
            userController.validateRegister,
            catchErrors(userController.register),
            authController.login
        );
//render the login form
router.get('/login',authController.loginForm);
//log the user in - log the current  user out first before logging in the new user, to prevent overlaps
router.post('/login',authController.validateLogin,authController.login);
//log the user out
router.get('/logout',authController.isLoggedIn,authController.logout);
//show a user's profile
router.get('/profile/:id',catchErrors(userController.profile)); //to do make it a regex route
//edit user's profile
router.get('/profile/:id/edit',
            authController.isLoggedIn,
            catchErrors(authController.checkProfileOwnership),
            catchErrors(userController.editProfileForm)
        )
//update the user's profile
router.post('/profile/:id',
            authController.isLoggedIn,
            catchErrors(authController.checkProfileOwnership),
            catchErrors(userController.updateProfile)
        )
//password reset flow
router.post('/account/forgot',authController.validateForgotPassword,catchErrors(authController.forgot));
router.get('/account/reset/:token',catchErrors(authController.reset));
router.post('/account/reset/:token',authController.confirmPasswords,catchErrors(authController.setPassword));

//show a user's posts
router.get('/profile/:id/posts',catchErrors(postController.userPost))






//==============
//COMMENT ROUTES
//==============

router.post('/posts/:id/comments',
            authController.isLoggedIn,
            commentController.validateComment,
            catchErrors(commentController.createComment)
         ); 

//==========================
//Handle unregistered routes
//==========================
router.get('*',(req,res)=>{
    res.send('Route does not exist');
})  

//===========
//API SEARCH
//===========
router.post('/posts/api/search',catchErrors(postController.searchPosts));
module.exports = router;