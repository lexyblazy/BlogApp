const router = require('express').Router();
const authController = require('../controllers/authControllers');
const postController = require('../controllers/postControllers');
const categoryController = require('../controllers/categoryControllers');
const userController = require('../controllers/userControllers');
const commentController = require('../controllers/commentControllers');
const {catchErrors} = require('../handlers/errorhandlers')

//============
//POSTS ROUTES
//============
router.get('/',postController.home);
//view all blog posts
router.get('/posts',postController.posts);
//render a form to create a new post
router.get('/posts/new',authController.isLoggedIn,postController.newForm);
//save the post to the database
router.post('/posts',
            authController.isLoggedIn,
            postController.upload,
            catchErrors(postController.resize),
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
            postController.upload,
            catchErrors(postController.resize),
            postController.validatePost,
            catchErrors(authController.checkPostOwnership),
            catchErrors(postController.updatePost)
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
//log the user in
router.post('/login',authController.login);
//log the user out
router.get('/logout',authController.isLoggedIn,authController.logout);
//show a user's profile
router.get('/profile/:id',userController.profile);
//edit user's profile
router.get('/profile/:id/edit',
            authController.isLoggedIn,
            catchErrors(authController.checkProfileOwnership),
            catchErrors(userController.editProfileForm)
        )

//==============
//COMMENT ROUTES
//==============

router.get('/posts/:id/comments/new',authController.isLoggedIn,catchErrors(commentController.commentForm));
router.post('/posts/:id/comments',
            authController.isLoggedIn,
            commentController.validateComment,
            catchErrors(commentController.createComment)
         );   


module.exports = router;