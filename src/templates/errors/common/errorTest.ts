/**
 * errorTest (fragment)
 */
export const errorTest = `import * as eh from './errorHandlers.js'
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
  })`