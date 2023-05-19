const express = require('express');
const router = express.Router();
const { validateTokenHandler } = require('../middleware/validateTokenHandler');
const { SongCollect } = require('../models/collectModels');
const Song = require('../models/songModel');
const { postCollectSong, getCollectSong, removeSongFromCollection } = require('../controllers/collectSongController');

router.use(validateTokenHandler);

router.post('/',postCollectSong );

router.get('/',getCollectSong);

router.delete('/?id', removeSongFromCollection);

module.exports = router;