export const userRouter = `import type { FastifyInstance } from 'fastify'
import { UserController } from './UserController.js'
import { UserService } from './UserService.js'
import { users } from './users.js'
import * as sch from './schemas.js'

const userIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false
} as const

export default async function userRouter(fastify: FastifyInstance) {
  const userService = new UserService(users)
  const controller = new UserController(userService)

  fastify.get('/', controller.getAll)

  fastify.get<{ Params: sch.UserId }>('/:id', {
    schema: {
      params: userIdParamsSchema
    }
  }, controller.getById)

  fastify.post<{ Body: sch.CreateUser }>('/', {
    schema: {
      body: sch.createUser
    }
  }, controller.create)

  fastify.put<{ Params: sch.UserId, Body: sch.Update }>('/:id', {
    schema: {
      params: userIdParamsSchema,
      body: sch.update
    }
  }, controller.update)

  fastify.delete<{ Params: sch.UserId }>('/:id', {
    schema: {
      params: userIdParamsSchema
    }
  }, controller.delete)

}`
