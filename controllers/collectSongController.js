const { SongCollect, PlaylistCollect } = require('../models/collectModels');
const Song = require('../models/songModel');
const asyncHandler = require('express-async-handler');
const request = require('../request');

/**
 * @description post the user collect song
 * @route POST /apis/collect/song
 * @access private
 */

const postCollectSong = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const collection = await SongCollect.findOne({userId:userId, songCloundId:id});
    console.log(collection);
    if(collection){
        res.status(400);
        throw new Error('this Collect relation is exist!');
    }
    const songExist = await Song.findOne({id:id});
    let newSongData;
    if(!songExist){
        const data = await request('/song/detail',{ids:id});
        const cloudSong = data.songs[0];
        const songData = {
            id:id,
            artistName:cloudSong.ar.map((value)=>value.name).join(','),
            name:cloudSong.name,
            coverUrl:cloudSong.al.picUrl,
            albumName:cloudSong.al.name
        }
        newSongData = await Song.create(songData);
    }
    const { _id } = songExist ? songExist :newSongData
    const songCollect = new SongCollect({
        userId:userId,
        songId:_id,
        songCloudId:id
    });
    songCollect.save();
    const collectSong = songExist?songExist:newSongData;
    res.status(200).json({msg:'添加成功', data:collectSong});
});

/**
 * @description Get the songs which the user collect
 * @route GET /apis/collect/song
 * @access private
 */

const getCollectSong = asyncHandler( async ( req, res ) => {
    const userId = req.user.id;
    const collectSongs = await SongCollect.find({userId:userId}).populate('songId');
    res.status(200).json({songs:collectSongs.map(value=>value.songId)});
})

/**
 * @description Remove the song which user collect
 * @route DELETE /apis/collect/song/?id
 * @access private
 */
const removeSongFromCollection = asyncHandler( async ( req, res ) => {
    const userId = req.user.id;
    const songId = req.params.id;
    console.log(songId);
    const deleteData = await SongCollect.findOneAndDelete({userId:userId, songCloudId:songId});
    if(deleteData){
        res.status(200).json({msg:'删除成功',deleteData:deleteData});
    }else{
        res.status(400);
        throw new Error('This collection is not exist!')
    }
} )

/**
 * @description Remove the songs which user collect
 * @route post /apis/collect/song/delect
 */

const removeSongsByIds = asyncHandler( async (req, res) => {
    const userId = req.user.id;
    const ids = req.body.ids;
    const idsArr = ids.split(',').map(parseInt);
    const deleteDatas = await SongCollect({userId:userId, songCloudId:{$in:idsArr}});
    res.status(200).json({msg:'删除成功',deleteDatas:deleteDatas});
} )

/**
 * @description Judge the song is collected?
 * @route Get /apis/collect/song/:id
 * @access private
 */

const getIsCollectSong = asyncHandler(async (req,res)=>{
    const userId = req.user.id;
    const id = req.params.id;
    console.log(id);
    const collection = await SongCollect.findOne({
        userId:userId,
        songCloudId:id
    })

    const isCollect = collection?true:false;
    res.status(200).json({isCollect:isCollect});
})

module.exports = {
    postCollectSong,
    getCollectSong,
    removeSongFromCollection,
    removeSongsByIds,
    getIsCollectSong
}
