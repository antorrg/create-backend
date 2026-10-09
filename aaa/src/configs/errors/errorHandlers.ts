import logger from '../logger.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { ERROR_CODE, type ErrorCode } from './errorCodes.js'
import { ErrorStatus, statusToErrorCode } from './errorStatusMap.js'
const isErrorCode = (code: string): code is ErrorCode => code in ERROR_CODE

const loggerActive: boolean = process.env.LOG_ERRORS !== 'false'
export interface AppErrorOptions {
  message?: string
  contexts?: string[]
  details?: unknown
  cause?: unknown
  status?: number
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly status?: number
  public contexts: string[]
  public details?: unknown

  constructor(code: ErrorCode, options?: string | AppErrorOptions) {
    const customMessage = typeof options === 'string' ? options : options?.message
    const opts = typeof options === 'string' ? undefined : options

    super(customMessage ?? code, { cause: opts?.cause })

    this.name = 'AppError'
    this.code = code
    this.status = opts?.status
    this.contexts = opts?.contexts ?? []
    this.details = opts?.details
  }
}


function contextsFor(code: ErrorCode | string, extra?: string[]): string[] {
  return [...(isErrorCode(code) ? [] : [code]), ...(extra ?? [])]
}

export function throwError(
  code: ErrorCode | string,
  options?: string | AppErrorOptions
): never {
  const normalizedCode = isErrorCode(code) ? code : 'UNEXPECTED_ERROR'

  if (typeof options === 'string') {
    throw new AppError(normalizedCode, { message: options, contexts: contextsFor(code) })
  }

  const opts = options ?? {}
  throw new AppError(normalizedCode, { ...opts, contexts: contextsFor(code, opts.contexts) })
}

export function processError(err: unknown, context: string): never {
  let normalized: AppError

  if (err instanceof AppError) {
    normalized = err
  } else if (err instanceof Error) {
    normalized = new AppError('UNEXPECTED_ERROR', { message: err.message, cause: err, details: err })
  } else {
    normalized = new AppError('UNKNOWN_THROWN_VALUE', { cause: err, details: err })
  }

  if (normalized.contexts.at(-1) !== context) {
    normalized.contexts.push(context)
  }

  throw normalized
}

export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err
  }

  if (typeof err === 'string') {
    const code = isErrorCode(err) ? err : 'UNEXPECTED_ERROR'
    return new AppError(code, { cause: err })
  }

  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>
    const rawStatus = obj.status ?? obj.statusCode
    const status = typeof rawStatus === 'number' ? rawStatus : undefined
    const details = obj.details ?? obj.validation

    if (typeof obj.code === 'string' && isErrorCode(obj.code)) {
      return new AppError(obj.code, {
        message: typeof obj.message === 'string' ? obj.message : undefined,
        details,
        cause: err,
        status
      })
    }

    if (status !== undefined) {
      const code = statusToErrorCode(status)
      return new AppError(code, {
        message: typeof obj.message === 'string' ? obj.message : undefined,
        details,
        cause: err,
        status
      })
    }

    if (typeof obj.message === 'string') {
      return new AppError('UNEXPECTED_ERROR', { message: obj.message, cause: err })
    }
  }

  return new AppError('UNEXPECTED_ERROR', { cause: err })
}



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
  

  