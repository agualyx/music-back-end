const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const validateTokenHandler = asyncHandler(async (req, res, next) => {
    const authorization = req.headers.authorization || req.headers.Authorization;
    if(authorization&&authorization.startsWith("Bearer")){
        const token = authorization.split(' ')[1];
        if(!token){
            res.status(401);
            throw new Error('User is not vaild or token is missing!');
        }
        jwt.verify(token,process.env.JWT_SECRECT,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error('User is not authorized!');
            }
            console.log(`${req.baseUrl}  verify success`);
            req.user = decoded.user;
            next();
        })
    }else{
        res.status(401);
        throw new Error('User is not vaild or token is missing!');
    }
})

module.exports = {
    validateTokenHandler
}