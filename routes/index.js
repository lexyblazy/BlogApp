const router = require('express').Router();
const postController = require('../controllers/postControllers');
const {catchErrors} = require('../handlers/errorhandlers')

router.get('/',postController.home);
router.get('/posts',postController.posts);
router.get('/posts/new',postController.newForm);
router.post('/posts',
            postController.upload,
            catchErrors(postController.resize),
            catchErrors(postController.createNew));
router.get('/posts/:slug',postController.show);
module.exports = router;