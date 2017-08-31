const router = require('express').Router();
const postController = require('../controllers/postControllers');
const categoryController = require('../controllers/categoryControllers');
const userController = require('../controllers/userControllers');
const {catchErrors} = require('../handlers/errorhandlers')

//============
//POSTS ROUTES
//============
router.get('/',postController.home);
//view all blog posts
router.get('/posts',postController.posts);
//render a form to create a new post
router.get('/posts/new',postController.newForm);
//save the post to the database
router.post('/posts',
            postController.upload,
            catchErrors(postController.resize),
            catchErrors(postController.createNew)
        );
//show more info about a specific post
router.get('/posts/:slug',postController.show);
//render a form to edit a post
router.get('/posts/:id/edit',postController.editForm)
//update and save post the the db
router.post('/posts/:id',
            postController.upload,
            catchErrors(postController.resize),
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
router.get('/register',userController.registerForm);
module.exports = router;