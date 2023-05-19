const express = require('express');
const userRoute = require('./routes/userRoute');
const avatarRoute = require('./routes/avatarRoute');
const { errorHandler } = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cores = require('cors');
const playlistRoute = require('./routes/playlistRoute');
const collectSongRoute = require('./routes/collectSongRoute');


connectDb();
 
// console.log(process.env)

const app = express();

const port = process.env.PORT || 5000;

app.use(cores());
app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use('/apis/user',userRoute);
app.use('/apis/upload',avatarRoute);
app.use('/apis/playlist',playlistRoute);
app.use('/apis/collect/song',collectSongRoute);
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})