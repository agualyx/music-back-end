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
    }
},{
    timestamps:true
});

const playlistCollectSchema=mongoose.Schema({
    playlistId:{
        type:String,
        require:[true,"Please add the playlist id"],
        ref:'playlists'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true, "Please add the user id"],
        ref:'users'
    }
})



const SongCollect = mongoose.model('songCollect',songCollectSchema); 
const ArtistCollect = mongoose.model('artistCollect',artistCollectSchema);
const PlaylistCollect = mongoose.model('playlistCollect',playlistCollectSchema)

module.exports = { SongCollect, ArtistCollect, PlaylistCollect };