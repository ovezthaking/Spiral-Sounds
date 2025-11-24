import express from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js'
import { logSignin } from '../middleware/logSignin.js'

export const authRouter = express.Router()

authRouter.post('/register', registerUser)

authRouter.post('/login', logSignin, loginUser)

authRouter.get('/logout', logoutUser)