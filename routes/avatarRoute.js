const express = require('express');
const {validateTokenHandler} = require('../middleware/validateTokenHandler');
const { upload } = require('../middleware/upload')
const { uploadTheAvatar } = require('../controllers/avatarController')

const router = express.Router();

router.use(validateTokenHandler);

router.post('/',upload.single('avatar'),uploadTheAvatar)

module.exports = router;
