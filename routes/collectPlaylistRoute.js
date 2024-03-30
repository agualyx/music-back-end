const express = require('express');
const router = express.Router();
const { validateTokenHandler } = require('../middleware/validateTokenHandler');
const { postCollectPlaylist,getCollectPlaylist, removePlaylistFromCollection } = require('../controllers/collectPlaylistController');

router.use(validateTokenHandler);

router.post('/',postCollectPlaylist);

router.get('/',getCollectPlaylist);

router.delete('/:id',removePlaylistFromCollection);

module.exports = router;