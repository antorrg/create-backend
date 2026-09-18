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

export const authController = `import type { Request, Response, NextFunction } from 'express'
import { middError, ERROR_CODE } from '../../configs/errors.js'
import { responder } from '../../shared/utils/responder.js'
import type { AuthService } from './AuthService.js'
import { Auth, type UserRole } from '../../shared/auth/authMiddlewares.js'
import envConfig from '../../configs/envConfig.js'

export class AuthController {
  private readonly authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  login = async(req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await this.authService.login(email, password)

    const userSessionData = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    }

    // Guardamos en la sesión (regenera la sesión para evitar session fixation)
    await Auth.login(req, userSessionData)

    // Cookie visible para el cliente (sincronizada a 30m con la sesión)
    res.cookie('logged_in', 'true', {
      httpOnly: false,
      secure: envConfig.Status === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 30 // 30m
    })

    responder(res, 200, userSessionData)
  }

  logout = async(req: Request, res: Response) => {
    await Auth.logout(req)
    res.clearCookie('app.sid', {
      path: '/',
      httpOnly: true,
      secure: envConfig.Status === 'production',
      sameSite: 'lax'
    })
    res.clearCookie('logged_in')
    responder(res, 200, 'Sesión cerrada')
  }

  me = async(req: Request, res: Response, next: NextFunction) => {
    const user = Auth.getSessionUser(req)
    if (!user) {
      return next(middError(ERROR_CODE.ACCESS_DENIED, 'No autenticado'))
    }
    responder(res, 200, user)
  }
}`

export const authRouter = `import express from 'express'
import { AuthService } from './AuthService.js'
import { AuthController } from './AuthController.js'
//import { RateLimiter } from '../../Shared/Middlewares/RateLimiter.js'

const authService = new AuthService()
const authController = new AuthController(authService)

const authRouter = express.Router()

authRouter.post(
  '/login', 
  //RateLimiter.loginRateLimiter, 
  authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/me', authController.me)

export default authRouter`