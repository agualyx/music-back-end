const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * @description post user info to register
 * @route POST /apis/user/register
 * @access public
 */

const postRegister = asyncHandler(async (req,res)=>{
    const { username, email, password, avatar } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userValid = await User.findOne({email});
    if(userValid){
        res.status(400);
        throw new Error('The user is existed!');
    }

    const hashPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username,
        email,
        password:hashPassword,
        avatar:avatar?avatar:null
    })
    res.status(201).json({
        msg:'Create success!',
        data:{
            _id:user.id,
            email:user.email,
            avatar:user.avatar,
            username:user.username
        }
    });
})

/**
 * @description post user info to login
 * @route POST /apis/user/login
 * @access public
 */

const postLogin = asyncHandler(async (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        console.log(1);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    if(user&&(await bcrypt.compare(password,user.password))){
        const token = jwt.sign({
            user:{
                email: user.email,
                id: user.id,
            }
        },process.env.JWT_SECRECT,
        {
            expiresIn: "7d"
        })
        res.status(200).json({
            accessToken:token
        })
    }else{
        res.status(401);
        throw new Error("The username or password is not current!");
    }
})

/**
 * @description get current user info
 * @route GET /apis/user/current
 * @access private
 */

const getCurrent = asyncHandler(async (req,res)=>{
    const { id } = req.user;
    const user = await User.findById(id);
    if(!user){
        res.status(404);
        throw new Error('User not exist!')
    }
    const { email, username, avatar } = user
    const userInfo = {email,username,avatar};
    res.status(200).json(userInfo);
})

/**
 * @description update user info
 * @route PUT /apis/user/update
 * @access private
 */

const updateUserInfo = asyncHandler( async (req,res)=>{
    const { id } = req.user;
    const { email, password } = req.body;
    if( email || password){
        res.status(403);
        throw new Error('Modify this info is forbidden!');
    }
    const user = await User.findById(id);
    if(!user){
        res.status(404);
        throw new Error('User not exist!')
    }
    const updatedInfo = await User.findByIdAndUpdate(
        id,
        req.body,
        {new:true}
    );
    const data = {username:updatedInfo.username,avatar:updatedInfo.avatar}
    res.status(200).json(data)
})


module.exports={
    postRegister,
    postLogin,
    getCurrent,
    updateUserInfo
}