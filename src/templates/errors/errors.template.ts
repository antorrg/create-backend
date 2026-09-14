import type { FilePattern } from "../../types.js"
import { getErrorHandlerSnippet, getErrorHandlerTestSnippet, getErrorExportsSnippet } from "./getErrorHandlerSnippets.js"

export const errorsTemplate = (options: FilePattern) => {
    const errorHandler = getErrorHandlerSnippet(options.selectedServer)
    const errorHandlerTest = getErrorHandlerTestSnippet(options.selectedServer)
    const errorExport = getErrorExportsSnippet(options.selectedServer)
// Include statusMap in function scope
const statusMap = {
  path: `/${options.sourceFolderName}/configs/errors/errorStatusMap.ts`,
  file: `import { ERROR_CODE, type ErrorCode } from './errorCodes.js'

export const ErrorStatus: Record<ErrorCode, number> = {
  // Generic
  [ERROR_CODE.UNKNOWN_ERROR]: 500,
  [ERROR_CODE.INTERNAL_ERROR]: 500,
  [ERROR_CODE.UNEXPECTED_ERROR]: 500,
  [ERROR_CODE.UNKNOWN_THROWN_VALUE]: 500,
  [ERROR_CODE.NOT_IMPLEMENTED]: 501,
  [ERROR_CODE.OPERATION_FAILED]: 500,
  [ERROR_CODE.NOT_FOUND]: 404,
  [ERROR_CODE.ROUTE_NOT_FOUND]: 404,
  [ERROR_CODE.DUPLICATE_ENTRY]: 409,
  [ERROR_CODE.ALREADY_EXISTS]: 409,

  // Validation
  [ERROR_CODE.VALIDATION_ERROR]: 400,
  [ERROR_CODE.INVALID_INPUT]: 400,
  [ERROR_CODE.INVALID_JSON]: 400,
  [ERROR_CODE.REQUIRED_FIELD_MISSING]: 400,
  [ERROR_CODE.FIELD_TOO_LONG]: 400,
  [ERROR_CODE.FIELD_TOO_SHORT]: 400,
  [ERROR_CODE.INVALID_FORMAT]: 400,
  [ERROR_CODE.INVALID_TYPE]: 400,
  [ERROR_CODE.OUT_OF_RANGE]: 400,
  [ERROR_CODE.VALUE_NOT_ALLOWED]: 400,
  [ERROR_CODE.DUPLICATE_VALUE]: 409,

  // Authorization & Authentication
  [ERROR_CODE.UNAUTHORIZED]: 401,
  [ERROR_CODE.INVALID_CREDENTIALS]: 400,
  [ERROR_CODE.MISSING_TOKEN]: 401,
  [ERROR_CODE.EXPIRED_TOKEN]: 401,
  [ERROR_CODE.INVALID_TOKEN]: 401,
  [ERROR_CODE.ACCESS_BLOCKED]: 401,
  [ERROR_CODE.ACCESS_DENIED]: 403,
  [ERROR_CODE.INSUFFICIENT_PERMISSIONS]: 403,
  [ERROR_CODE.ROLE_NOT_ALLOWED]: 403,
  [ERROR_CODE.RESOURCE_FORBIDDEN]: 403,
  [ERROR_CODE.FORBIDDEN]: 403,

  // Resources
  [ERROR_CODE.RESOURCE_NOT_FOUND]: 404,
  [ERROR_CODE.RESOURCE_ALREADY_EXISTS]: 409,
  [ERROR_CODE.RESOURCE_LOCKED]: 423,
  [ERROR_CODE.RESOURCE_DISABLED]: 403,
  [ERROR_CODE.RESOURCE_DELETED]: 410,

  // System
  [ERROR_CODE.SERVICE_UNAVAILABLE]: 503,
  [ERROR_CODE.SERVICE_TIMEOUT]: 504,
  [ERROR_CODE.DEPENDENCY_FAILURE]: 502,
  [ERROR_CODE.DEPENDENCY_UNAVAILABLE]: 503,
  [ERROR_CODE.RATE_LIMIT_EXCEEDED]: 429,

  // Persistence
  [ERROR_CODE.DATA_READ_ERROR]: 500,
  [ERROR_CODE.DATA_WRITE_ERROR]: 500,
  [ERROR_CODE.DATA_INTEGRITY_ERROR]: 500,
  [ERROR_CODE.DATA_CONSTRAINT_VIOLATION]: 409,
  [ERROR_CODE.DATA_CONFLICT]: 409,

  // Security
  [ERROR_CODE.SECURITY_VIOLATION]: 403,
  [ERROR_CODE.CSRF_DETECTED]: 403,
  [ERROR_CODE.SUSPICIOUS_ACTIVITY]: 403,
  [ERROR_CODE.REQUEST_BLOCKED]: 403,

  // Operations
  [ERROR_CODE.OPERATION_NOT_ALLOWED]: 405,
  [ERROR_CODE.INVALID_OPERATION_STATE]: 400,
  [ERROR_CODE.PRECONDITION_FAILED]: 412,

  // Files
  [ERROR_CODE.FILE_REQUIRED]: 400,
  [ERROR_CODE.FILE_TOO_LARGE]: 413,
  [ERROR_CODE.FILE_TYPE_NOT_ALLOWED]: 415,
  [ERROR_CODE.FILE_UPLOAD_FAILED]: 500,
  [ERROR_CODE.FILE_DELETE_FAILED]: 500,

  // Notifications
  [ERROR_CODE.NOTIFICATION_FAILED]: 500,

  // Session
  [ERROR_CODE.SESSION_EXPIRED]: 401,
  [ERROR_CODE.SESSION_INVALID]: 401,
  [ERROR_CODE.CLIENT_STATE_INVALID]: 400,

  // Environment
  [ERROR_CODE.CONFIG_MISSING]: 500,
  [ERROR_CODE.CONFIG_INVALID]: 500,
  [ERROR_CODE.ENVIRONMENT_ERROR]: 500
}
  `
}

   const code = [
{
   path: `/${options.sourceFolderName}/configs/errors/errorCodes.ts`,
  file: `export const ERROR_CODE = {
  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  UNKNOWN_THROWN_VALUE: 'UNKNOWN_THROWN_VALUE',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  OPERATION_FAILED: 'OPERATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_JSON: 'INVALID_JSON',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  FIELD_TOO_LONG: 'FIELD_TOO_LONG',
  FIELD_TOO_SHORT: 'FIELD_TOO_SHORT',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_TYPE: 'INVALID_TYPE',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  VALUE_NOT_ALLOWED: 'VALUE_NOT_ALLOWED',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',

  // Authorization & Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  MISSING_TOKEN: 'MISSING_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  ACCESS_BLOCKED: 'ACCESS_BLOCKED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_NOT_ALLOWED: 'ROLE_NOT_ALLOWED',
  RESOURCE_FORBIDDEN: 'RESOURCE_FORBIDDEN',
  FORBIDDEN: 'FORBIDDEN',

  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',
  RESOURCE_DISABLED: 'RESOURCE_DISABLED',
  RESOURCE_DELETED: 'RESOURCE_DELETED',

  // System
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  SERVICE_TIMEOUT: 'SERVICE_TIMEOUT',
  DEPENDENCY_FAILURE: 'DEPENDENCY_FAILURE',
  DEPENDENCY_UNAVAILABLE: 'DEPENDENCY_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Persistence
  DATA_READ_ERROR: 'DATA_READ_ERROR',
  DATA_WRITE_ERROR: 'DATA_WRITE_ERROR',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR',
  DATA_CONSTRAINT_VIOLATION: 'DATA_CONSTRAINT_VIOLATION',
  DATA_CONFLICT: 'DATA_CONFLICT',

  // Security
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  CSRF_DETECTED: 'CSRF_DETECTED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  REQUEST_BLOCKED: 'REQUEST_BLOCKED',

  // Operations
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INVALID_OPERATION_STATE: 'INVALID_OPERATION_STATE',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',

  // Files
  FILE_REQUIRED: 'FILE_REQUIRED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  FILE_DELETE_FAILED: 'FILE_DELETE_FAILED',

  // Notifications
  NOTIFICATION_FAILED: 'NOTIFICATION_FAILED',

  // Session
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_INVALID: 'SESSION_INVALID',
  CLIENT_STATE_INVALID: 'CLIENT_STATE_INVALID',

  // Environment
  CONFIG_MISSING: 'CONFIG_MISSING',
  CONFIG_INVALID: 'CONFIG_INVALID',
  ENVIRONMENT_ERROR: 'ENVIRONMENT_ERROR'
} as const

export type ErrorCode = keyof typeof ERROR_CODE
  `
},
{
  path: `/${options.sourceFolderName}/configs/errors/errorHandlers.ts`,
  file: `import logger from '../logger.js'
${errorHandler.imports}
import { ERROR_CODE, type ErrorCode } from './errorCodes.js'
${options.projectType === 'webServer'? `import { ErrorStatus } from './errorStatusMap.js'`: ''}


const isErrorCode = (code: string): code is ErrorCode => code in ERROR_CODE

const loggerActive: boolean = process.env.LOG_ERRORS !== 'false'

export interface AppErrorOptions {
  message?: string
  contexts?: string[]
  details?: unknown
  cause?: unknown
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public contexts: string[]
  public details?: unknown

  constructor(code: ErrorCode, options?: string | AppErrorOptions) {
    const customMessage = typeof options === 'string' ? options : options?.message
    const opts = typeof options === 'string' ? undefined : options

    super(customMessage ?? code, { cause: opts?.cause })

    this.name = 'AppError'
    this.code = code
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
    if (typeof obj.code === 'string' && isErrorCode(obj.code)) {
      return new AppError(obj.code, {
        message: typeof obj.message === 'string' ? obj.message : undefined,
        details: obj.details,
        cause: err
      })
    }

    if (typeof obj.message === 'string') {
      return new AppError('UNEXPECTED_ERROR', { message: obj.message, cause: err })
    }
  }

  return new AppError('UNEXPECTED_ERROR', { cause: err })
}



${errorHandler.handler}

  `
},
{
  path: `/${options.sourceFolderName}/configs/errors/errorHandlers.test.ts`,
  file: `import { describe, it, expect, vi, beforeEach } from 'vitest'
${errorHandlerTest.imports}
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
${errorHandlerTest.handler}
})
  `
},

{
 path: `/${options.sourceFolderName}/configs/errors.ts`,
 file: `
 ${errorExport.imports}
 ${errorExport.handler}
 `
},
    ]
 if(options.projectType === 'webServer'){
    code.push(statusMap)
 }
    return code
}

