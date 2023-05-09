const asyncHandler = require('express-async-handler')
/**
 * @description User pick there avatar and Upload to the Server.
 * @route POST /apis/upload/avatars
 * @access private
 */
const uploadTheAvatar = asyncHandler( async (req,res) => {
    const { filename } = req.file;
    console.log(`Upload the image success! The filename is ${filename}`);
    const avatarUrl = `http://localhost:${process.env.PORT}/uploads/avatars/${filename}`;
    res.status(200).json({avatarUrl});  
})

module.exports = {
    uploadTheAvatar
}