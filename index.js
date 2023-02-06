import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath }from 'url';

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
app.use(express.json({ limit: '30mb', extended: true}));
app.use(express.urlencoded({ limit: '30mb', extended: true}));
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
	filename: function( req, file, cb){
		cb(null, file.originalname);
	}
})

const upload = multer({ storage });



app.listen(PORT, ()=>{
	console.log('server is running... ')
})
