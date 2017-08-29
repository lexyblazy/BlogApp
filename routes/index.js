const router = require('express').Router();
const postController = require('../controllers/postControllers');

router.get('/',postController.home);
router.get('/posts',postController.posts);
router.get('/posts/new',postController.newForm);
router.post('/posts',postController.createNew);

module.exports = router;