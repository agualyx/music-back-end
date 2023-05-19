const express = require('express');
const router = express.Router();
const { validateTokenHandler } = require('../middleware/validateTokenHandler');
const uuid = require('uuid');
const Playlist = require('../models/playlistModel');
const Song = require('../models/songModel')
const PlaylistSong = require('../models/playlistSongModel')
const { postCreate, getPlaylist, addSong, getPlaylistDetail, deletePlaylist, deleteSong } = require('../controllers/playlistController')

router.use(validateTokenHandler);

router.post('/create',postCreate);

router.get('/',getPlaylist);

router.get('/?id', getPlaylistDetail);

router.post('/add/?id',addSong);

router.delete('/?id',deletePlaylist);

router.delete('/song/?id',deleteSong )

module.exports = router;