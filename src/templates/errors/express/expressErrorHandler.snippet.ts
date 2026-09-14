export const expressErrorHandlerSnippet = {
  imports: `import { type Request, type Response, type NextFunction } from 'express'`,
  handler: `
export function middError(
  code: ErrorCode | string,
  middlewareName?: string,
  options?: AppErrorOptions
): AppError {
  const normalizedCode = isErrorCode(code) ? code : 'UNEXPECTED_ERROR'
  const baseContext = middlewareName
    ? \`Middleware error in [\${middlewareName}]:\`
    : 'Middleware error:'

  return new AppError(normalizedCode, {
    message: options?.message,
    contexts: [baseContext, ...contextsFor(code, options?.contexts)],
    details: options?.details,
    cause: options?.cause
  })
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const e = normalizeError(err)

  if (loggerActive) logger.error(e)

  const response: Record<string, unknown> = {
    ok: false,
    code: e.code,
    message: e.message
  }

  if (e.details !== undefined) {
    response.details = e.details
  }

  res.status(ErrorStatus[e.code] ?? 500).json(response)
}

export const jsonFormat = (
  err: Error & { status?: number; statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status ?? err.statusCode
  if (
    err instanceof SyntaxError &&
    status === ErrorStatus[ERROR_CODE.INVALID_JSON] &&
    'body' in err
  ) {
    next(middError(ERROR_CODE.INVALID_JSON, 'jsonFormat'))
  } else {
    next(err)
  }
}

export const notFoundRoute = (req: Request, res: Response, next: NextFunction): void => {
  next(middError('ROUTE_NOT_FOUND', 'notFoundRoute'))
}
  `
}
export const expressErrorHandlerTestSnippet = {
  imports: `import { type Request, type Response, type NextFunction } from 'express'`,
  handler: `
  describe('Express middlewares', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
      req = {}
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      }
      next = vi.fn()
    })
    describe('middError', () => {
      it('returns an AppError with Middleware error context', () => {
        const err = eh.middError('MISSING_TOKEN')
        expect(err).toBeInstanceOf(AppError)
        expect(err.code).toBe('MISSING_TOKEN')
        expect(err.contexts).toEqual(['Middleware error:'])
      })

      it('returns an AppError with specific middleware name', () => {
        const err = eh.middError('MISSING_TOKEN', 'AuthMiddleware', { contexts: ['Additional'] })
        expect(err.contexts).toEqual(['Middleware error in [AuthMiddleware]:', 'Additional'])
      })

      it('returns an AppError appending provided context', () => {
        const err = eh.middError('MISSING_TOKEN', undefined, { contexts: ['AuthService'] })
        expect(err.contexts).toEqual(['Middleware error:', 'AuthService'])
      })
    })

    describe('errorHandler', () => {
      it('handles AppError properly and uses logger.error', () => {
        const error = new AppError('RESOURCE_NOT_FOUND')
        eh.errorHandler(error, req as Request, res as Response, next)

        expect(logger.error).toHaveBeenCalledWith(error)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          code: 'RESOURCE_NOT_FOUND',
          message: 'RESOURCE_NOT_FOUND'
        })
      })

      it('normalizes standard errors to UNEXPECTED_ERROR AppError and logs them', () => {
        const standardError = new Error('Syntax error during parsing')
        eh.errorHandler(standardError, req as Request, res as Response, next)

        expect(logger.error).toHaveBeenCalledTimes(1)
        const loggedError = (logger.error as any).mock.calls[0][0]
        expect(loggedError).toBeInstanceOf(AppError)
        expect(loggedError.code).toBe('UNEXPECTED_ERROR')
        expect(loggedError.cause).toBe(standardError)
        expect(res.status).toHaveBeenCalledWith(500)
        // el Error original queda en \`cause\` para logs, nunca en la respuesta al cliente
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          code: 'UNEXPECTED_ERROR',
          message: 'Syntax error during parsing'
        })
      })

      it('normalizes string error code to correct numeric status', () => {
        eh.errorHandler('RESOURCE_NOT_FOUND', req as Request, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          code: 'RESOURCE_NOT_FOUND',
          message: 'RESOURCE_NOT_FOUND'
        })
      })

      it('normalizes object with code property to correct numeric status, without leaking the raw object', () => {
        eh.errorHandler({ code: 'UNAUTHORIZED' }, req as Request, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          code: 'UNAUTHORIZED',
          message: 'UNAUTHORIZED'
        })
      })

      it('exposes only the explicit details field when the source object provides one', () => {
        eh.errorHandler({ code: 'UNAUTHORIZED', message: 'Token expired', details: { reason: 'expired' } }, req as Request, res as Response, next)
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          code: 'UNAUTHORIZED',
          message: 'Token expired',
          details: { reason: 'expired' }
        })
      })
    })

    describe('jsonFormat', () => {
      it('returns middError(INVALID_JSON) for body SyntaxError with status 400', () => {
        const err = new SyntaxError('Unexpected token') as Error & { status?: number, body?: string }
        err.status = 400
        err.body = '{ bad json }'

        eh.jsonFormat(err, req as Request, res as Response, next)

        expect(next).toHaveBeenCalledTimes(1)
        const nextArg = (next as any).mock.calls[0][0]
        expect(nextArg).toBeInstanceOf(AppError)
        expect(nextArg.code).toBe('INVALID_JSON')
      })

      it('passes error to next() if not a 400 body SyntaxError', () => {
        const err = new Error('Normal error')
        eh.jsonFormat(err as Error, req as Request, res as Response, next)
        expect(next).toHaveBeenCalledWith(err)
      })
    })

    describe('notFoundRoute', () => {
      it('calls next() with ROUTE_NOT_FOUND', () => {
        eh.notFoundRoute(req as Request, res as Response, next)
        expect(next).toHaveBeenCalledTimes(1)
        const nextArg = (next as any).mock.calls[0][0]
        expect(nextArg).toBeInstanceOf(AppError)
        expect(nextArg.code).toBe('ROUTE_NOT_FOUND')
      })
    })

  })  
  `}

  export const expressErrorExportsSnippet = {
    imports: `import {  errorHandler, throwError, processError, middError, normalizeError, jsonFormat, notFoundRoute } from './errors/errorHandlers.js'`,
    handler:`
import { ERROR_CODE } from './errors/errorCodes.js'

export {
  normalizeError,
  throwError,
  processError,
  ERROR_CODE,
  middError,
  errorHandler,
  jsonFormat,
  notFoundRoute,
}
    `
  }