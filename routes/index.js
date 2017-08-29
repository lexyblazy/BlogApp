const router = require('express').Router();
const postController = require('../controllers/postControllers');

router.get('/',postController.home);
router.get('/posts',postController.posts);
module.exports = router;