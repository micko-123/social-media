import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async(req, res) =>{
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			picturePath,
			friends,
			location,
			occupation
		} = req.body;


		console.log(req)
		const passwordHash = await bcrypt.hash(password, 12);
		console.log(passwordHash)

		const newUser = new User({
			firstName,
			lastName,
			email,
			password:passwordHash,
			picturePath,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 10000),
			impressions: Math.floor(Math.random() * 10000),
		})

		const savedUser = await newUser.save();
		
		savedUser.password = null

		res.status(201).json(savedUser);

	}catch(err) {
		res.status(500).json({error: err.message})
	}
}

export const login = async(req, res)=>{
	try{
		const { email, password } = req.body;
		const user = await User.findOne({email})

		if(!user){
			res.status(404).json({
				 message: "user does not exist"
			})
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid cridential"})

		const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

		user.password = null
		res.status(200).json({
			user,
			token
		})

	}catch(err){
		res.status(500).json({error: err.message})
	}
}
