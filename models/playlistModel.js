const mongoose = require('mongoose');

const playListSchema = mongoose.Schema({
    id:{
        type:String,
        require:[true, "Please add the playlist id"],
        unique:[true, "The id already taken"]
        
    },
    creatorId:{
        type:mongoose.Types.ObjectId,
        default:null,
        ref:'users'
    },
    name:{
        type:String,
        require:[true, "Please add the playlist name"]
    },
    coverUrl:{
        type:String,
        default:'',
    },
    songNumber:{
        type:Number,
        default:0,
    },
    description:{
        type:String,
        default:''
    }
},{
    timestamps:true
}) 

module.exports = mongoose.model('playlists',playListSchema);