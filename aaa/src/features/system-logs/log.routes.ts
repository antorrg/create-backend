import type { FastifyInstance } from 'fastify'
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
}