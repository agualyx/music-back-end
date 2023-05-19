const { SongCollect, PlaylistCollect } = require('../models/collectModels');
const Song = require('../models/songModel');
const asyncHandler = require('express-async-handler');

/**
 * @description post the user collect song
 * @route POST /apis/collect/song
 * @access private
 */

const postCollectSong = asyncHandler(async (req, res) => {
    const { id, songName, albumName, artist, picUrl } = req.body;
    const userId = req.user.id;
    try{
        const collection = await SongCollect.find({userId:userId, songId:id});
        if(collection){
            res.status(400);
            throw new Error('this Collect relation is exist!');
        }
        const songExist = await Song.findOne({id:id});
        let newSongData;
        if(!songExist){
            const songData = {
                id:id,
                artistName:artist,
                name:songName,
                coverUrl:picUrl,
                albumName:albumName
            }
            newSongData = await Song.create(songData);
        }
        const { _id } = songExist ? songExist :newSongData
        const songCollect = new SongCollect({
            userId:userId,
            songId:_id
        });
        songCollect.save();
        res.status(200).json({msg:'添加成功'});
    }catch(e){
        res.status(500);
        throw e;
    }
});

/**
 * @description Get the songs which the user collect
 * @route GET /apis/collect/song
 * @access private
 */

const getCollectSong = asyncHandler( async ( req, res ) => {
    const userId = req.user.id;
    try{
        const collectSongs = SongCollect.find({userId:userId}).populate('songs');
        res.status(200).json({songs:collectSongs});
    }catch(e){ 
        res.status(500);
        throw e;
    }
})

/**
 * @description Remove the song which user collect
 * @route DELETE /apis/collect/song/?id
 * @access private
 */
const removeSongFromCollection = asyncHandler( async ( req, res ) => {
    const userId = req.user.id;
    const songId = req.params.id;
    try{
        const { _id } = await Song.findOne({id:songId});
        if(_id){
            const data = await SongCollect.findOneAndDelete({
                userId:userId,
                songId:songId
            });
            res.status({
                msg:'删除成功',
                data:data
            })
        }else{
            res.status(500);
            throw new Error('The Database has problem')
        }
    }catch(e){
        res.status(500);
        throw e;
    }
} )

module.exports = {
    postCollectSong,
    getCollectSong,
    removeSongFromCollection
}
