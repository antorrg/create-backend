import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { FastifyRequest, FastifyReply } from 'fastify'
import * as eh from './errorHandlers.js'
import logger from '../logger.js'
const AppError = eh.AppError

// Mock logger to avoid polluting test output
vi.mock('../logger.js', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}))

describe('Error Handlers', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AppError instances', () => {
    it('Creates an instance with code and message', () => {
      const error = new AppError('RESOURCE_NOT_FOUND')
      expect(error.code).toBe('RESOURCE_NOT_FOUND')
      expect(error.message).toBe('RESOURCE_NOT_FOUND')
      expect(error.contexts).toEqual([])
    })

    it('Respects custom message and details', () => {
      const error = new AppError('RESOURCE_NOT_FOUND', { message: 'Custom message', details: { id: 123 } })
      expect(error.message).toBe('Custom message')
      expect(error.details).toEqual({ id: 123 })
    })

    it('Respects contextual data', () => {
      const error = new AppError('RESOURCE_NOT_FOUND', { contexts: ['UserService'] })
      expect(error.contexts).toEqual(['UserService'])
    })
  })

  describe('throwError', () => {
    it('throws an AppError', () => {
      expect(() => eh.throwError('UNKNOWN_ERROR')).toThrow(AppError)
      try {
        eh.throwError('RESOURCE_NOT_FOUND', { contexts: ['Repo'] })
      } catch (error: any) {
        expect(error.code).toBe('RESOURCE_NOT_FOUND')
        expect(error.contexts).toEqual(['Repo'])
      }
    })

    it('supports passing message directly as second argument', () => {
      try {
        eh.throwError('INVALID_INPUT', 'Field email is invalid')
      } catch (error: any) {
        expect(error.code).toBe('INVALID_INPUT')
        expect(error.message).toBe('Field email is invalid')
      }
    })
  })

  describe('processError', () => {
    it('should append context to an existing AppError', () => {
      const existingError = new AppError('RESOURCE_NOT_FOUND')
      try {
        eh.processError(existingError, 'UserService')
      } catch (err: any) {
        expect(err.contexts).toEqual(['UserService'])
      }
    })

    it('should not append duplicate context if already ends with it', () => {
      const existingError = new AppError('RESOURCE_NOT_FOUND', { contexts: ['UserService'] })
      try {
        eh.processError(existingError, 'UserService')
      } catch (err: any) {
        expect(err.contexts).toEqual(['UserService'])
      }
    })

    it('should convert an Error to AppError with UNEXPECTED_ERROR code and store in details', () => {
      const stdError = new Error('Database down')
      try {
        eh.processError(stdError, 'DatabaseLayer')
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError)
        expect(err.code).toBe('UNEXPECTED_ERROR')
        expect(err.contexts).toEqual(['DatabaseLayer'])
        expect(err.details).toBe(stdError)
      }
    })

    it('should convert an unknown literal to AppError with UNKNOWN_THROWN_VALUE', () => {
      try {
        eh.processError('some weird string error', 'UnknownLayer')
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError)
        expect(err.code).toBe('UNKNOWN_THROWN_VALUE')
        expect(err.contexts).toEqual(['UnknownLayer'])
        expect(err.details).toBe('some weird string error')
      }
    })
  })
describe('Fastify handlers', () => {
    let req: Partial<FastifyRequest>
    let reply: Partial<FastifyReply>
    let reqLog: { error: ReturnType<typeof vi.fn> }

    beforeEach(() => {
      reqLog = { error: vi.fn() }
      req = {
        log: reqLog as any
      }
      reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
      }
    })

    describe('errorHandler', () => {
      it('handles AppError properly and uses request.log.error', () => {
        const error = new AppError('RESOURCE_NOT_FOUND')
        eh.errorHandler(error, req as FastifyRequest, reply as FastifyReply)

        expect(reqLog.error).toHaveBeenCalledWith(error)
        expect(reply.status).toHaveBeenCalledWith(404)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'RESOURCE_NOT_FOUND',
          message: 'RESOURCE_NOT_FOUND'
        })
      })

      it('normalizes standard errors to UNEXPECTED_ERROR AppError and logs them', () => {
        const standardError = new Error('Syntax error during parsing')
        eh.errorHandler(standardError, req as FastifyRequest, reply as FastifyReply)

        expect(reqLog.error).toHaveBeenCalledTimes(1)
        const loggedError = reqLog.error.mock.calls[0][0]
        expect(loggedError).toBeInstanceOf(AppError)
        expect(loggedError.code).toBe('UNEXPECTED_ERROR')
        expect(loggedError.cause).toBe(standardError)
        expect(reply.status).toHaveBeenCalledWith(500)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'UNEXPECTED_ERROR',
          message: 'Syntax error during parsing'
        })
      })

      it('normalizes string error code to correct numeric status', () => {
        eh.errorHandler('RESOURCE_NOT_FOUND', req as FastifyRequest, reply as FastifyReply)
        expect(reply.status).toHaveBeenCalledWith(404)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'RESOURCE_NOT_FOUND',
          message: 'RESOURCE_NOT_FOUND'
        })
      })

      it('normalizes object with code property to correct numeric status', () => {
        eh.errorHandler({ code: 'UNAUTHORIZED' }, req as FastifyRequest, reply as FastifyReply)
        expect(reply.status).toHaveBeenCalledWith(401)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED'
        })
      })

      it('exposes explicit statusCode from native errors if available', () => {
        const fastifyErr = { statusCode: 400, message: 'Invalid payload' }
        eh.errorHandler(fastifyErr, req as FastifyRequest, reply as FastifyReply)
        expect(reply.status).toHaveBeenCalledWith(400)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'UNEXPECTED_ERROR',
          message: 'Invalid payload'
        })
      })

      it('exposes only the explicit details field when provided', () => {
        eh.errorHandler({ code: 'UNAUTHORIZED', message: 'Token expired', details: { reason: 'expired' } }, req as FastifyRequest, reply as FastifyReply)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'UNAUTHORIZED',
          message: 'Token expired',
          details: { reason: 'expired' }
        })
      })

      it('falls back to global logger if request.log is unavailable', () => {
        const error = new AppError('RESOURCE_NOT_FOUND')
        eh.errorHandler(error, {} as FastifyRequest, reply as FastifyReply)
        expect(logger.error).toHaveBeenCalledWith(error)
      })
    })

    describe('notFoundHandler', () => {
      it('sends 404 response with ROUTE_NOT_FOUND code', () => {
        eh.notFoundHandler(req as FastifyRequest, reply as FastifyReply)
        expect(reply.status).toHaveBeenCalledWith(404)
        expect(reply.send).toHaveBeenCalledWith({
          ok: false,
          code: 'ROUTE_NOT_FOUND',
          message: 'ROUTE_NOT_FOUND'
        })
      })
    })
  })
  
})
  