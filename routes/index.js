const router = require('express').Router();
const postController = require('../controllers/postControllers');
const {catchErrors} = require('../handlers/errorhandlers')

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
module.exports = router;