const asyncHandler = require('express-async-handler');
const Playlist = require('../models/playlistModel');
const uuid = require('uuid');

/**
 * @description User create the playlist
 * @route POST /apis/playlist/create
 * @access private
 */

const postCreate = asyncHandler (async (req,res)=>{
    const { name,descripation,coverUrl } = req.body;
    const { id } = req.user;
    if(!name){
        res.status(400);
        throw new Error('Please input the name');
    }
    try{
        const newPlaylist = new Playlist({
            name:name,
            id:uuid.v4(),
            creatorId:id,
            coverUrl:coverUrl?coverUrl:null,
            descripation:descripation?descripation:''
        });
        newPlaylist.save();
        res.status(200).json(newPlaylist);
    }catch(e){
        res.status(500)
        throw e;
    }
})

/**
 * @description Get playlists which user create
 * @route GET /apis/playlist
 * @access private
 */

const getPlaylist = asyncHandler(async (req,res)=>{
    const creatorId = req.user&&req.user.id;
    const playlist = await Playlist.find({creatorId:creatorId})
    res.status(200).json(playlist?playlist:[]);
})

module.exports = {
    postCreate,
    getPlaylist
}