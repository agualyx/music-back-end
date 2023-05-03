const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please add the user password"],
    },
    password:{
        type:String,
        required:[true, "Please add the password"]
    },
    email:{
        type:String,
        required:[true, "Please add the email"],
        unique:[true, "The email address already taken"]
    },
    avatar:{
        type:String,
    }
},{
    timeStamps:true
})

module.exports = mongoose.model('users',userSchema);