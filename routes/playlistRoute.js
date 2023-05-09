const express = require('express');
const router = express.Router();
const { validateTokenHandler } = require('../middleware/validateTokenHandler');
const uuid = require('uuid');
const Playlist = require('../models/playlistModel');
const { postCreate, getPlaylist } = require('../controllers/playlistController')

router.post('/create',validateTokenHandler,postCreate);

router.get('/',validateTokenHandler,getPlaylist)

module.exports = router;