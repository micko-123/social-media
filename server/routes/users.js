import express from 'express';
import { getUsers, getUser, addRemoveFriends, getUserFriends } from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'
const router = express.Router()

router.get('/', getUsers)

router.get('/:id',verifyToken, getUser)
router.get('/:id/:friends',verifyToken, getUserFriends)

router.patch('/:id/:friendId', verifyToken, addRemoveFriends)

export default router