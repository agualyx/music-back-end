const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getCurrent, updateUserInfo } = require('../controllers/userController')
const { validateTokenHandler } = require('../middleware/validateTokenHandler');

router.post('/register',postRegister)

router.post('/login',postLogin)

router.get('/current',validateTokenHandler,getCurrent)

router.put('/update',validateTokenHandler,updateUserInfo)

module.exports=router;