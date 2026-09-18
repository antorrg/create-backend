export const fastifyErrorHandlerSnippet = {
  imports: `import type { FastifyRequest, FastifyReply } from 'fastify'`,
  handler: `
export function errorHandler(
  err: unknown,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const e = normalizeError(err)

  if (loggerActive) {
    if (request && typeof request.log?.error === 'function') {
      request.log.error(e)
    } else {
      logger.error(e)
    }
  }

  let status: number

  if (typeof err === 'object' && err !== null && 'statusCode' in err && typeof (err as any).statusCode === 'number') {
    status = (err as any).statusCode
  } else if (typeof err === 'object' && err !== null && 'status' in err && typeof (err as any).status === 'number') {
    status = (err as any).status
  } else {
    status = ErrorStatus[e.code] ?? 500
  }

  const response: Record<string, unknown> = {
    ok: false,
    code: e.code,
    message: e.message
  }


  if (e.details !== undefined) {
    response.details = e.details
  }

  reply.status(status).send(response)
}

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply): void {
  const e = new AppError('ROUTE_NOT_FOUND')

  if (loggerActive) {
    if (request && typeof request.log?.error === 'function') {
      request.log.error(e)
    } else {
      logger.error(e)
    }
  }

  reply.status(404).send({
    ok: false,
    code: e.code,
    message: e.message
  })
}
  `
}
export const fastifyErrorHandlerTestSnippet = {
  imports: `import type { FastifyRequest, FastifyReply } from 'fastify'`,
  handler: `describe('Fastify handlers', () => {
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
  `}

  export const fastifyErrorExportsSnippet = {
    imports: `import { errorHandler, throwError, processError, normalizeError, notFoundHandler } from './errors/errorHandlers.js'`,
    handler:`
import { ERROR_CODE } from './errors/errorCodes.js'

export {
  normalizeError,
  throwError,
  processError,
  ERROR_CODE,
  errorHandler,
  notFoundHandler
}
    `
  }