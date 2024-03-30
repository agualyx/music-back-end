const mongoose = require('mongoose');

const songCollectSchema = mongoose.Schema({
    songId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true,"Please add the collect song id"],
        ref:'songs',
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true,"Please add the userId id"],
        ref:'users',
    },
    songCloudId:{
        type:Number,
        require:[true,"Please add the clound song id"]
    }
},{
    timestamps:true
})

const artistCollectSchema = mongoose.Schema({
    artistId:{
        type:Number,
        require:[true,"Please add the artist id"],
        ref:'artist'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true,"Please add the user id"],
        ref:'users'
    },
    artistCloudId:{
        type:Number,
        require:[true,"Please add the playlist cloud Id"]
    }
},{
    timestamps:true
});

const playlistCollectSchema=mongoose.Schema({
    playlistId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true,"Please add the playlist id"],
        ref:'playlists'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true, "Please add the user id"],
        ref:'users'
    },
    playlistCloudId:{
        type:String,
        require:[true,"Please add the clound playlist id"]
    }
},{
    timestamps:true
})



const SongCollect = mongoose.model('songCollect',songCollectSchema); 
const ArtistCollect = mongoose.model('artistCollect',artistCollectSchema);
const PlaylistCollect = mongoose.model('playlistCollect',playlistCollectSchema)

module.exports = { SongCollect, ArtistCollect, PlaylistCollect };