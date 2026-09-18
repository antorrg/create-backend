/**
 * authService
 * authController
 * authRouter
 */
export const authService =  `import { userService } from '../../shared/dependencies.js'


export class AuthService {
  async login(email: string, password: string) {
    return await userService.login(email, password)
    
  }
}`

export const authController = `import type { FastifyRequest, FastifyReply } from 'fastify'
import { throwError, ERROR_CODE } from '../../configs/errors.js'
import { responder } from '../../shared/utils/responder.js'
import type { AuthService } from './AuthService.js'
import { Auth, type UserRole } from '../../shared/auth/authPreHandlers.js'
import envConfig from '../../configs/envConfig.js'

export class AuthController {
  private readonly authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email?: string; password?: string }
    if (!email || !password) {
      throwError(ERROR_CODE.INVALID_INPUT, 'Email y contraseña requeridos')
    }
    const user = await this.authService.login(email, password)

    const userSessionData = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    }

    await Auth.login(request, userSessionData)

    reply.setCookie('logged_in', 'true', {
      httpOnly: false,
      secure: envConfig.Status === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 30,
      path: '/'
    })

    return responder(reply, 200, userSessionData)
  }

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    await Auth.logout(request)
    reply.clearCookie('app.sid', {
      path: '/',
      httpOnly: true,
      secure: envConfig.Status === 'production',
      sameSite: 'lax'
    })
    reply.clearCookie('logged_in', { path: '/' })
    return responder(reply, 200, 'Sesión cerrada')
  }

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = Auth.getSessionUser(request)
    if (!user) {
      throwError(ERROR_CODE.ACCESS_DENIED, 'No autenticado')
    }
    return responder(reply, 200, user)
  }
}`

export const authRouter = `import type { FastifyInstance } from 'fastify'
import { AuthService } from './AuthService.js'
import { AuthController } from './AuthController.js'

const authService = new AuthService()
const authController = new AuthController(authService)

const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as const

export default async function authRouter(fastify: FastifyInstance) {
  fastify.post('/login', {
    schema: {
      body: loginSchema
    }
  }, authController.login)

  fastify.post('/logout', authController.logout)

  fastify.get('/me', authController.me)
}`