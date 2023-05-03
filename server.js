const express = require('express');
const userRoute = require('./routes/userRoute');
const avatarRoute = require('./routes/avatarRoute');
const { errorHandler } = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cores = require('cors');


connectDb();
 
// console.log(process.env)

const app = express();

const port = process.env.PORT || 5000;

app.use(cores());
app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use('/apis/user',userRoute);
app.use('/apis/upload/avatars',avatarRoute);
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})