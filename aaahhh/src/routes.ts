
import express from 'express'
import userRouter from './features/user/user.routes.js'

const mainRouter = express.Router()

mainRouter.use('/api/v1/user', userRouter)



export default mainRouter
