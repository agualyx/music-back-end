const asyncHandler = require('express-async-handler');
const Playlist = require('../models/playlistModel');
const PlaylistSong = require('../models/playlistSongModel');
const Song = require('../models/songModel')
const uuid = require('uuid');
const request = require('../request');
const res = require('express/lib/response');

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
    const { limit=20, offset=0 } = req.params;
    const creatorId = req.user&&req.user.id;
    try{
        const playlist = await Playlist
        .find({creatorId:creatorId})
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        res.status(200).json(playlist?playlist:[]);
    }catch(e){
        res.status(400);
        throw e;
    }
})

/**
 * @description add a song to the playlist
 * @route POST /apis/playlist/add/:id
 * @access private
 */

const addSong = asyncHandler(async ( req, res ) => {
    const { id } = req.body;
    const playlistId = req.params.id;
    const songData = await Song.findOne({id:id});
    console.log(songData);
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
            songId:_id,

        });
        newRelation.save();
    }else{
        console.log(1);
        const data = await request('/song/detail',{ids:id});
        const cloudSong = data.songs[0];
        const { name } = cloudSong;
        const albumName = cloudSong.al.name;
        const coverUrl = cloudSong.al.picUrl;
        const artistName = cloudSong.ar.map((item)=>item.name).join(',');

        const newSongData = await Song.create({
            id:id,
            name:name,
            artistName:artistName,
            albumName:albumName,
            coverUrl:coverUrl
        })
        const { _id } = newSongData;
        const newRelation = new PlaylistSong({
            playlistId:playlistId,
            songId:_id,
        });
        newRelation.save();
    }
    // 更新歌曲值
    const data = await Playlist.findByIdAndUpdate(playlistId,{$inc:{songNumber:1}});
    res.status(200).json({msg:'加入成功', data:data});

})

/**
 * @description Get the playlist detail
 * @route GET /apis/playlist/:id
 * @description private
 */

const getPlaylistDetail = asyncHandler(async(req,res)=>{
    const playlistId = req.params.id;
    const playlistInfo = await Playlist.findById(playlistId);
    if(!playlistInfo){
        res.status(400);
        throw new Error('The playlist is not exist')
    }
    const songs = await PlaylistSong.find({playlistId:playlistId}).populate('songId')
    const data = {playlistInfo,songs:songs.map((item)=>item.songId)};
    res.status(200).json(data);

})

/**
 * @description Delete the playlist and the relation of the playlist
 * @route DELETE /apis/playlist/delete/?id
 * @access private
 */
const deletePlaylist = asyncHandler(async (req,res)=>{
    const playlistId = req.params.id;
    try{
        const deleteData = await Playlist.findByIdAndDelete(playlistId);
        await PlaylistSong.deleteMany({playlistId:playlistId});
        res.status(200).json({msg:'删除成功', data:deleteData});
    }catch(e){
        res.status(400);
        throw e;
    }
})

/**
 * @description Delete the song of the playlist
 * @route POST /apis/playlist/song/:id
 * @access private
 */

const deleteSong = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const { ids } = req.body;
    const idSet = ids.split(',');
    try{
        const data = await PlaylistSong.deleteMany({
            songId:{$in:idSet},
            playlistId:id
        })
        res.status(200).json({
            msg:'删除成功',
            data:data
        });
        await Playlist.findByIdAndUpdate(id,{$inc:{songNumber:-idSet.length}});
    }catch(e){
        res.status(500);
        throw e;
    }
})

/**
 * @description Update the playlist info
 * @route PUT /apis/playlists/update/:id
 * @access private
 */

const updatePlaylistInfo = asyncHandler( async (req,res) => {
    const id = req.params.id;
    const playlist = await Playlist.findById(id);
    if(!playlist){
        res.status(404);
        throw new Error('Playlist not exist');
    }
    const updateInfo = await Playlist.findByIdAndUpdate(id,req.body,{new:true});
    const data = { name:updateInfo.name, description:updateInfo.description, coverUrl: updateInfo.coverUrl };
    res.status(200).json(data);
})

/**
 * @description Add songs
 * @route POST /apis/playlists/add/songs/:id
 * @access private
 */

const addSongsByIds = asyncHandler( async (req, res) => {
    const playlistId = req.params.id;
    const songIds = req.body.ids;
    const songIdArr = songIds.split(',');
    const containSongs = await Song.find({id:{$in:songIdArr}});
    const map = new Map(containSongs.map((value)=>[value.id,value._id]));
    console.log(map);
    const notContainIds = songIdArr.filter((value)=>{return !map.has(parseInt(value))});
    const ids = notContainIds.join(',');
    console.log(ids);
    if(ids!==''){
        const cloundDatas = await request('/song/detail',{ids:ids});
        const cloudSongs = cloundDatas.songs;
        const insertDatas = await Song.insertMany(cloudSongs.map((value)=>{
            return {
                id:value.id,
                name:value.name,
                artistName:value.ar.map((item)=>item.name).join(','),
                albumName:value.al.name,
                coverUrl:value.al.picUrl
            }
        }));
        insertDatas.forEach((value)=>{
            map.set(value.id,value._id);
        }); 
    }
    const newRelations = songIdArr.map((value)=>{
        return {
            playlistId:playlistId,
            songId:map.get(parseInt(value))
        }
    })
    console.log(newRelations);
    const relations = await PlaylistSong.find({playlistId:playlistId});
    // console.log(relations);
    const existSongs = new Set(relations.map((value)=>value.songId.toString()));
    console.log(existSongs);
    const insertRelations = newRelations.filter(({songId})=>!existSongs.has(songId.toString()));
    console.log(insertRelations);
    if(insertRelations.length===0){
        res.status(400);
        throw new Error('歌曲已存在');
    }
    const insertData = await PlaylistSong.insertMany(insertRelations);
    await Playlist.findByIdAndUpdate(playlistId,{$inc:{songNumber:insertData.length}});
    console.log(insertData);
    res.status(200).json({msg:'加入成功',data:insertData});
} )

module.exports = {
    postCreate,
    getPlaylist,
    addSong,
    getPlaylistDetail,
    deletePlaylist,
    deleteSong,
    updatePlaylistInfo,
    addSongsByIds,
}