const mongoose = require('mongoose');

const playlistSongSchema = mongoose.Schema({
    playlistId:{
        type:mongoose.Types.ObjectId,
        require:[true, "Pleast input the playlistId"],
        ref:'playlists'
    },
    songId:{
        type:mongoose.Types.ObjectId,
        require:[true, "Please input the songId"],
        ref:'songs'
    }
},{
    timestamps:true
})

module.exports = mongoose.model('playlist_song_ref',playlistSongSchema);