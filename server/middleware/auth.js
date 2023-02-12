import jwt from "jsonwebtoken"

export const verifyToken = async(req, res, next) => {
	try{
		const token = req.header("authorization");

		if(!token) return res.status(403).json({ msg:no token provided})

		if(token.startWith('Bearer ')){
			token = token.slice(7, token.length).trimLeft()
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET)

		req.user = verified
		next()
		
	}catch(err){
		res.status(500).json({
			error: err.message
		})
	}
}
