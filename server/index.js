import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath }from 'url';

import { register } from './controllers/auth.js'
import { createPost } from './controllers/post.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import postRoute from './routes/post.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(()=>{
	console.log('db connected')
	}).catch((error) => { console.log('error while connecting to db')})


// configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


// file storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, 'public/assets');
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
})

const upload = multer({ storage });

// routes
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/posts', postRoute)

app.listen(PORT, ()=>{
	console.log('server is running... ')
})

// npm i react-redux @reduxjs/toolkit redux-persist react-dropzone dotenv 
// npm i formik yup react-router-dom@6 @mui/material @emotion/react @emotion/styled @mui/icons-material