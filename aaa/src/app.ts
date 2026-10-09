import Fastify from 'fastify'
import * as conf from './configs/serverConfig.js'
import logger from './configs/logger.js'
import { errorHandler, notFoundHandler } from './configs/errors.js'
import userRouter from './features/user/user.routes.js'
import logRouter from './features/system-logs/log.routes.js'



const fastify = Fastify({
  loggerInstance: logger,
  ajv: { customOptions: conf.ajvOptions }
})

fastify.setErrorHandler(errorHandler)
fastify.setNotFoundHandler(notFoundHandler)


await fastify.register(userRouter, { prefix: '/api/v1/user' })

await fastify.register(logRouter, { prefix: '/api/v1/logs' })


export default fastify
