import express from 'express'
import userRouter from './features/user/user.routes.js'
import logRouter from './features/system-logs/log.routes.js'

const mainRouter = express.Router()

mainRouter.use('/api/v1/user', userRouter)


mainRouter.use('/api/v1/logs', logRouter)

export default mainRouter
