const express = require('express');
const {validateTokenHandler} = require('../middleware/validateTokenHandler');
const { uploadAvatar, uploadCover } = require('../middleware/upload')
const { uploadTheAvatar, uploadTheCover } = require('../controllers/avatarController')

const router = express.Router();

router.use(validateTokenHandler);

router.post('/avatars',uploadAvatar.single('avatar'),uploadTheAvatar)

router.post('/covers',uploadCover.single('cover'),uploadTheCover)

module.exports = router;
