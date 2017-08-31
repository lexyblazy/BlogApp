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
router.get('/posts/:id/edit',authController.isLoggedIn,postController.editForm)
//update and save post the the db
router.post('/posts/:id',
            authController.isLoggedIn,
            postController.upload,
            catchErrors(postController.resize),
            postController.validatePost,
            catchErrors(postController.updatePost)
        )

//=================
//CATEGORIES ROUTES
//=================

//show all categories
router.get('/categories',categoryController.categories);
//create a new category form
router.get('/categories/new',categoryController.addForm);
//save the category to DB
router.post('/categories',catchErrors(categoryController.create));
//get a specific category
router.get('/categories/:category',catchErrors(categoryController.getCategory));

//===========
//USER ROUTES
//===========
router.get('/register',userController.registerForm,);
router.post('/register',
            userController.validateRegister,
            catchErrors(userController.register),
            authController.login
        );
router.get('/login',authController.loginForm);
router.post('/login',authController.login);
router.get('/logout',authController.isLoggedIn,authController.logout);

//==============
//COMMENT ROUTES
//==============

router.get('/posts/:id/comments/new',catchErrors(commentController.commentForm));
router.post('/posts/:id/comments',
            commentController.validateComment,
            catchErrors(commentController.createComment)
         );   

module.exports = router;