const multer = require('multer');
const path = require('path');

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename:(req, file, cb) =>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
})

const uploadAvatar = multer({
    storage:avatarStorage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/covers/')
    },
    filename:(req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

const uploadCover = multer({
    storage:coverStorage,
    fileFilter: (req,file,cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null,true);
    }
})


module.exports = {
    uploadAvatar,
    uploadCover
}