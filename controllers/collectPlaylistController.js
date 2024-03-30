const { PlaylistCollect } = require('../models/collectModels');
const Playlist = require('../models/playlistModel');
const asyncHandler = require('express-async-handler');
const request = require('../request');
const res = require('express/lib/response');

/**
 * @description post the user collect playlist
 * @route POST /apis/collect/playlist
 * @access private
 */

const postCollectPlaylist = asyncHandler (async (req, res)=>{
    const { id } = req.body;
    const userId = req.user.id;
    const collection = await PlaylistCollect.findOne({userId:userId, playlistCloudId:id});
    if(collection){
        res.status(400);
        throw new Error('This collect relation is exist!');
    }
    const playlistExist = await Playlist.findOne({id:id});
    let newPlaylistData;
    if(!playlistExist){
        const data = await request('/playlist/detail',{id});
        const cloudPlaylist = data.playlist;
        const { name, coverImgUrl, trackCount, description  } = cloudPlaylist;
        const playlistData = {
            id:id,
            name:name,
            coverUrl:coverImgUrl,
            songNumber:trackCount,
            description:description
        }
        newPlaylistData = await Playlist.create(playlistData);
    }
    const collectPlaylist = playlistExist?playlistExist:newPlaylistData;
    const {_id} = collectPlaylist;
    const playlistCollect = new PlaylistCollect({
        userId:userId,
        playlistId:_id,
        playlistClondId:id
    });
    playlistCollect.save();
    res.status(200).json({msg:'添加成功',data:collectPlaylist});
})

/**
 * @description Get the plsylist which the user collect
 * @route GET /apis/collect/playlist
 * @access private
 */

const getCollectPlaylist = asyncHandler( async()=>{
    const userId = req.user.id;
    const collectPlaylists = await PlaylistCollect.find({userId:userId}).populate('playlistId');
    res.status(200).json({playlists:collectPlaylists.map(value=>value.playlistId)});
})

/**
 * @description Remove the playlist which user collect
 * @route DELETE /apis/collect/playlist/:id
 * @access private
 */

const removePlaylistFromCollection = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const playlistId = req.params.id;
    const deleteData = await PlaylistCollect.findOneAndDelete({userId:userId, playlistCloudId:playlistId});
    if(deleteData){
        res.status(400);
        throw new Error('This collection is not exist!')
    }
})

module.exports = {
    postCollectPlaylist,
    getCollectPlaylist,
    removePlaylistFromCollection
}