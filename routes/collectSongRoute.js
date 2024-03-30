const express = require('express');
const router = express.Router();
const { validateTokenHandler } = require('../middleware/validateTokenHandler');
const { SongCollect } = require('../models/collectModels');
const Song = require('../models/songModel');
const { postCollectSong, getCollectSong, removeSongFromCollection, removeSongsByIds, getIsCollectSong } = require('../controllers/collectSongController')

router.use(validateTokenHandler);

router.post('/', postCollectSong);

router.get('/', getCollectSong);

router.delete('/:id', removeSongFromCollection);

router.post('/delect', removeSongsByIds);

router.get('/:id', getIsCollectSong);

module.exports = router;