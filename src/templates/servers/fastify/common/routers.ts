/**
 * logRouter, userRouter
 */

export const logRouter =`import type { FastifyInstance } from 'fastify'
import { loggerServiceDb } from '../../configs/logger/LoggerServiceDb.js'
import { LoggerController } from '../../configs/logger/LoggerController.js'
import { logQuerySchema, idParamSchema, updateLogBodySchema } from './logSchema.js'

export default async function logRouter(fastify: FastifyInstance) {
  const logger = new LoggerController(loggerServiceDb)

  fastify.get('/', {
    schema: {
      querystring: logQuerySchema
    }
  }, logger.getAll)

  fastify.get('/:id', {
    schema: {
      params: idParamSchema
    }
  }, logger.getById)

  fastify.patch('/:id', {
    schema: {
      params: idParamSchema,
      body: updateLogBodySchema
    }
  }, logger.update)

  fastify.delete('/:id', {
    schema: {
      params: idParamSchema
    }
  }, logger.delete)

  fastify.delete('/clean', logger.deleteAll)
}`

export const userRouter = `import { UserController } from './UserController.js'
import { userService } from '../../shared/dependencies.js'
import * as sch from './userSchema.js'
import type { FastifyInstance } from 'fastify'

const userIdParamsSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId'],
  additionalProperties: false
} as const

export default async function userRouter (fastify: FastifyInstance) {
  const controller = new UserController(userService)

  fastify.get('/', controller.getAll)

  fastify.get<{ Params: sch.UserId }>('/:userId', {
    schema: {
      params: userIdParamsSchema
    }
  }, controller.getById)

  fastify.post<{ Body: sch.CreateUser }>('/', {
    schema: {
      body: sch.createUser
    }
  }, controller.create)

  fastify.put<{ Params: sch.UserId, Body: sch.UpdateProfile }>('/:userId', {
    schema: {
      params: userIdParamsSchema,
      body: sch.updateProfile
    }
  }, controller.updateProfile)

  fastify.delete<{ Params: sch.UserId }>('/:userId', {
    schema: {
      params: userIdParamsSchema
    }
  }, controller.delete)

  fastify.post<{ Body: sch.ChangePassword }>('/update-credentials', {
    schema: {
      body: sch.changePassword
    }
  }, controller.changePassword)

  fastify.patch<{ Params: sch.UserId, Body: sch.UpgradeUser }>('/:userId/assign-status', {
    schema: {
      params: userIdParamsSchema,
      body: sch.upgradeUser
    }
  }, controller.userUpgrade)
}
`