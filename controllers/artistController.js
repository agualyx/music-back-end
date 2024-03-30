const Artist = require('../models/artistModel');
const { ArtistCollect } = require('../models/collectModels');
const asyncHandler = require('express-async-handler');
const request = require('../request');

/**
 * @description post the user collect artist
 * @route POST /apis/collect/artist
 * @access private
 */

const postCollectArtist = asyncHandler(async (req,res)=>{
    const {id} = req.body;
    const userId = req.user.id;
    const collection = await ArtistCollect.findOne({userId:userId, artistCloudId:id});
    if(collection){
        res.status(400);
        throw new Error('this Collect relation is exist!');
    }
    const artistExist = await Artist.findOne({id:id});
    let newArtistData;
    if(!artistExist){
        const data = await request()
    }
})