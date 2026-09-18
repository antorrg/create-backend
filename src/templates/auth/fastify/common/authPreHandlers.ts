
export const authPrehandler = `import type { FastifyRequest, FastifyReply } from 'fastify'
import { throwError, ERROR_CODE } from '../../configs/errors.js'
import { CSRF } from './CSRF.js'
import envConfig from '../../configs/envConfig.js'

const csrfTokens = new CSRF({ saltLength: 8, secretLength: 18 })

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface SessionUser {
  id: string
  email: string
  role: UserRole
}

declare module '@fastify/session' {
  interface FastifySessionObject {
    user?: SessionUser
    csrfSecret?: string
  }
}

export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.OWNER]: 3
}

export const csrfProtection = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  if (!request.session) return
  if (!request.session.csrfSecret) {
    request.session.csrfSecret = csrfTokens.secretSync()
    await new Promise<void>((resolve, reject) => {
      request.session.save((err) => (err ? reject(err) : resolve()))
    })
  }
}

export const setCsrfToken = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  if (!request.session?.csrfSecret) return
  const secret = request.session.csrfSecret
  const token = csrfTokens.create(secret)
  reply.setCookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: envConfig.Status === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

export const verifyCsrfToken = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return
  const secret = request.session?.csrfSecret
  if (!secret) {
    throwError(ERROR_CODE.CSRF_DETECTED, { message: 'CSRF: session without secret' })
  }

  const body = request.body as Record<string, unknown> | undefined
  const token =
    (request.headers['x-csrf-token'] as string) ||
    (request.headers['csrf-token'] as string) ||
    (body?._csrf as string)

  if (!csrfTokens.verify(secret, token)) {
    throwError(ERROR_CODE.CSRF_DETECTED, { message: 'Invalid CSRF token' })
  }
}

export const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const user = request.session?.user
  if (!user) {
    throwError(ERROR_CODE.UNAUTHORIZED, { message: 'Unauthenticated' })
  }
}

export const authorize = (...allowedRoles: UserRole[]) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.session?.user
    if (!user) {
      throwError(ERROR_CODE.UNAUTHORIZED, { message: 'No autenticado' })
    }
    if (!allowedRoles.includes(user.role)) {
      throwError(ERROR_CODE.FORBIDDEN, { message: 'Accion no permitida' })
    }
  }

export const authorizeMinRole = (minimumRole: UserRole) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const sessionUser = request.session?.user
    if (!sessionUser) {
      throwError(ERROR_CODE.UNAUTHORIZED, { message: 'No autenticado' })
    }

    const userLevel = RoleHierarchy[sessionUser.role]
    const requiredLevel = RoleHierarchy[minimumRole]

    if (userLevel < requiredLevel) {
      throwError(ERROR_CODE.ROLE_NOT_ALLOWED, { message: 'Faltan permisos para esta accion' })
    }
  }

export class Auth {
  static async login(request: FastifyRequest, user: SessionUser): Promise<void> {
    if (!request.session) {
      throwError(ERROR_CODE.UNEXPECTED_ERROR, { message: 'Session is not initialized' })
    }
    const existingCsrfSecret = request.session.csrfSecret ?? csrfTokens.secretSync()
    if (typeof request.session.regenerate === 'function') {
      await new Promise<void>((resolve, reject) => {
        request.session.regenerate((err) => (err ? reject(err) : resolve()))
      })
    }
    request.session.user = user
    request.session.csrfSecret = existingCsrfSecret
    if (typeof request.session.save === 'function') {
      await new Promise<void>((resolve, reject) => {
        request.session.save((err) => (err ? reject(err) : resolve()))
      })
    }
  }

  static async logout(request: FastifyRequest): Promise<void> {
    if (!request.session) return
    if (typeof request.session.destroy === 'function') {
      await new Promise<void>((resolve, reject) => {
        request.session.destroy((err) => (err ? reject(err) : resolve()))
      })
    }
  }

  static getSessionUser(request: FastifyRequest): SessionUser | null {
    return request.session?.user ?? null
  }
}
`
