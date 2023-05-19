const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    id:{
        type:Number,
        require:[true, "Please add the artist id"],
        unique:[true, "The id already taken"]
        
    },
    name:{
        type:String,
        require:[true,"Please add the artist name"]
    },
    avatarUrl:{
        type:String,
        require:[true,"Please add the avatarUrl"]
    },
    gender:{
        type:String,
        enum:['male','female'],
        default:'male'
    }
},{
    timestamps:true
})

module.exports = mongoose.model('artists',artistSchema);