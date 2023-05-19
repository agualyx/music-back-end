const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    id:{
        type:Number,
        require:[true, "Please add the song id"],
        unique:[true, "The id already taken"]
        
    },
    artistName:{
        type:String,
        require:[true,"Please add the artistId"],
    },
    name:{
        type:String,
        require:[true,"Please add the song name"],
    },
    coverUrl:{
        type:String,
        require:[true,"Please add the coverUrl"]
    },
    albumName:{
        type:String,
        require:[true,"Please add the albumName"]
    }
},{
    timestamps:true
})

module.exports = mongoose.model('songs',songSchema)