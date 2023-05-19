const asyncHandler = require('express-async-handler');
const Playlist = require('../models/playlistModel');
const PlaylistSong = require('../models/playlistSongModel');
const Song = require('../models/songModel')
const uuid = require('uuid');

/**
 * @description User create the playlist
 * @route POST /apis/playlist/create
 * @access private
 */

const postCreate = asyncHandler (async (req,res)=>{
    const { name,description,coverUrl } = req.body;
    const { id } = req.user;
    if(!name){
        res.status(400);
        throw new Error('Please input the name');
    }
    try{
        const newPlaylist = new Playlist({
            id:uuid.v4(),
            name:name,
            creatorId:id,
            coverUrl:coverUrl?coverUrl:null,
            description:description?description:''
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

/**
 * @description add a song to the playlist
 * @route POST /apis/playlist/add/?id
 * @access private
 */

const addSong = asyncHandler(async ( req, res ) => {
    const { id, artist, songName, picUrl, albumName } = req.body;
    const playlistId = req.params.id;
    try{
        const songData = await Song.find({id:id});
        if(songData){
            const { _id } = songData;
            const relation = await PlaylistSong.findOne({
                playlistId:playlistId,
                songId:_id
            })
            if(relation){
                res.status(403);
                throw new Error(`This relation is exist`);
            }
            const newRelation = new PlaylistSong({
                playlistId:playlistId,
                songId:_id
            });
            newRelation.save();
        }else{
            const newSongData = await Playlist.create({
                id:id,
                name:songName,
                artistName:artist,
                albumName:albumName,
                coverUrl:picUrl
            })
            const { _id } = newSongData;
            const newRelation = new PlaylistSong({
                playlistId:playlistId,
                songId:_id
            });
            newRelation.save();
        }
        // 更新歌曲值
        Playlist.findByIdAndUpdate(playlistId,{$inc:{songNumber:1}});
        res.status(200).json({mag:'更新成功'});
    }catch(e){
        res.status(500);
        throw e;
    }

})

/**
 * @description Get the playlist detail
 * @route GET /apis/playlist/?id
 * @description private
 */

const getPlaylistDetail = asyncHandler(async(req,res)=>{
    const playlistId = req.params.id;
    try{
        const playlistInfo = await Playlist.findById(playlistId);
        if(!playlistInfo){
            res.status(400);
            throw new Error('The playlist is not exist')
        }
        const songs = await PlaylistSong.find({playlistId:playlistId}).populate('songs');
        const data = {...playlistInfo,songs};
        res.status(200).json(data);
    }catch(e){
        res.status(500);
        throw e;
    }

})

/**
 * @description Delete the playlist and the relation of the playlist
 * @route DELETE /apis/playlist/delete/?id
 * @access private
 */
const deletePlaylist = asyncHandler(async (req,res)=>{
    const playlistId = req.params.dictionary;
    try{
        await Playlist.findByIdAndDelete(playlistId);
        await PlaylistSong.deleteMany({playlistId:playlistId});
        res.status(200).json({msg:'删除成功'});
    }catch(e){
        res.status(400);
        throw e;
    }
})

/**
 * @description Delete the song of the playlist
 * @route DELETE /apis/playlist/song/?id
 * @access private
 */

const deleteSong = asyncHandler(async(req,res)=>{
    const playlistId = req.params.id;
    const { id } = req.body;
    try{
        const data = await PlaylistSong.findOneAndDelete({
            playlistId:playlistId,
            songId:id
        });
        res.status(200).json({
            msg:'删除成功',
            data:data
        });
    }catch(e){
        res.status(500);
        throw e;
    }
})

module.exports = {
    postCreate,
    getPlaylist,
    addSong,
    getPlaylistDetail,
    deletePlaylist,
    deleteSong
}