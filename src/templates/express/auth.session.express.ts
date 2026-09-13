import type { FilePattern } from "../../types.js"
import { sessionDbSnippets } from "../auth/sessionDbSnnipet.js"
import { selectOrmForInitDb } from '../selectOrmForInitDb.js'


export const authSessionExpress = (options: FilePattern)=>{
  const select = selectOrmForInitDb(options)
  const dbSnippet = sessionDbSnippets(options)
    return [
          {
        path:`/${options.sourceFolderName}/@types/index.d.ts`,
        file: `import type { Session, SessionData } from 'express-session'
import type { SessionUser } from '../shared/auth/authMiddlewares.js'

declare module 'express-session' {
  interface SessionData {
    csrfSecret?: string
    user?: SessionUser
    [key: string]: unknown
  }
}


declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>
    }
  }
}

export {}`
    },
        {
        path:`/${options.sourceFolderName}/shared/auth/session.ts`,
        file: `import session from 'express-session'
import sessionAdapter from './session/connect-db.js'
import DbSessionStore from './session/connect-session-app.js'
import envConfig from '../../configs/envConfig.js'



const store = envConfig.Status === 'test'
  ? new session.MemoryStore()
  : new DbSessionStore({
    adapter: sessionAdapter
  })


export const sessionMiddleware = session({
  name: 'app.sid',
  secret: envConfig.SessionSecret,
  store,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: envConfig.Status === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30 // 30m
  }
})`
},
{
    path:`/${options.sourceFolderName}/shared/auth/session.test.ts`,
    file: `import session from 'supertest'
import { describe, it, beforeAll, expect } from 'vitest'
import serverTest from './testHelpers/serverTest.help.js'
import { UserRole } from './authMiddlewares.js'

const agent = session.agent(serverTest)

const getCsrf = (res: any) => {
  const setCookie = res.get('Set-Cookie')
  if (!setCookie) return ''
  const csrfCookie = setCookie.find((c: string) => c.includes('XSRF-TOKEN'))
  return csrfCookie ? csrfCookie.split('=')[1].split(';')[0] : ''
}

describe('Session & CSRF Auth tests', () => {
  let csrfToken: string
  // let cookie: string // This variable is no longer needed

  beforeAll(async() => {
    // Get initial CSRF token and session cookie
    const response = await agent.get('/csrf')
    // const setCookie = response.get('Set-Cookie') // Replaced by getCsrf
    // if (setCookie) {
    //   cookie = setCookie.join('; ') // This is no longer needed
    //   const csrfCookie = setCookie.find(c => c.includes('XSRF-TOKEN'))
    //   csrfToken = csrfCookie?.split('=')[1].split(';')[0] || ''
    // }
    csrfToken = getCsrf(response)
  })

  it('should deny access if not authenticated', async() => {
    const res = await agent.get('/protected')
    expect(res.status).toBe(401)
    // The error handler might only return a message or a different structure
  })

  it('should login successfully and set session', async() => {
    const user = { id: '123', email: 'test@test.com', role: UserRole.USER }
    const res = await agent
      .post('/login')
      .set('x-csrf-token', decodeURIComponent(csrfToken))
      .send({ user })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should allow access to protected route after login', async() => {
    const res = await agent.get('/protected')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.user.email).toBe('test@test.com')
    console.log(res.body.user)
  })

  it('should deny access to admin route for normal user', async() => {
    const res = await agent.get('/admin')
    expect(res.status).toBe(403)
  })

  it('should allow access to admin route after admin login', async() => {
    const admin = { id: '456', email: 'admin@test.com', role: UserRole.ADMIN }

    // We need a fresh agent to clear the previous session or logout
    const adminAgent = session.agent(serverTest)
    // const init = await adminAgent.get('/protected') // Changed to /csrf to get a fresh token
    // const adminCsrf = init.get('Set-Cookie').find(c => c.includes('XSRF-TOKEN'))?.split('=')[1].split(';')[0] || '' // Replaced by getCsrf
    const init = await adminAgent.get('/csrf')
    const adminCsrf = getCsrf(init)

    await adminAgent
      .post('/login')
      .set('x-csrf-token', decodeURIComponent(adminCsrf))
      .send({ user: admin })

    const res = await adminAgent.get('/admin')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should logout successfully', async() => {
    const res = await agent
      .post('/logout')
      .set('x-csrf-token', decodeURIComponent(csrfToken))

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const protectedRes = await agent.get('/protected')
    expect(protectedRes.status).toBe(401)  })
})`
},
{
    path:`/${options.sourceFolderName}/shared/auth/authMiddlewares.ts`,
    file: `import { type Request, type Response, type NextFunction } from 'express'
import { middError, ERROR_CODE } from '../../configs/errors.js'
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
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.OWNER]: 3
}

// Genera el secreto en sesión (si no existe) y escribe el token en la cookie XSRF-TOKEN.
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  // Inicializar el secreto en sesión la primera vez
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = csrfTokens.secretSync()
    req.session.save((err) => {
      if (err) return next(middError(ERROR_CODE.CSRF_DETECTED, 'csrfProtection', { message: 'The session could not be initialized' }))
      next()
    })
    return
  }
  next()
}

// Expone el token CSRF en la cookie XSRF-TOKEN (legible por JS del cliente, sin httpOnly).
export const setCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  const secret = req.session.csrfSecret!
  const token = csrfTokens.create(secret)
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // debe ser legible por el cliente
    secure: envConfig.Status === 'production',
    sameSite: 'lax'
  })
  next()
}

// Verifica el token CSRF en métodos mutantes (POST, PUT, PATCH, DELETE).
// Lee el token desde header 'x-csrf-token', 'csrf-token' o body '_csrf'.
export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  const secret = req.session.csrfSecret
  if (!secret) {
    return next(middError(ERROR_CODE.CSRF_DETECTED, 'verifyCsrfToken', { message: 'CSRF: session without secret' }))
  }

  const token =
    (req.headers['x-csrf-token'] as string) ||
    (req.headers['csrf-token'] as string) ||
    (req.body?._csrf as string)

  if (!csrfTokens.verify(secret, token)) {
    return next(middError(ERROR_CODE.CSRF_DETECTED, 'verifyCsrfToken', { message: 'Invalid CSRF token' }))
  }

  next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = req.session.user
  if (!sessionUser) return next(middError(ERROR_CODE.UNAUTHORIZED, 'isAuthenticated', { message: 'Unauthenticated' }))
  next()
}

// RBAC
export const authorize =
  (...allowedRoles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = req.session.user
      if (!user) return next(middError(ERROR_CODE.UNAUTHORIZED, 'authorize', { message: 'No autenticado' }))

      if (!allowedRoles.includes(user.role)) {
        return next(middError(ERROR_CODE.FORBIDDEN, 'authorize', { message: 'Accion no permitida' }))
      }

      next()
    }

export const authorizeMinRole =
  (minimumRole: UserRole) =>
    (req: Request, res: Response, next: NextFunction) => {
      const sessionUser = req.session.user

      if (!sessionUser) {
        return next(middError(ERROR_CODE.UNAUTHORIZED, 'authorizeMinRole', { message: 'No autenticado' }))
      }

      const userLevel = RoleHierarchy[sessionUser.role as UserRole]
      const requiredLevel = RoleHierarchy[minimumRole]

      if (userLevel < requiredLevel) {
        return next(middError(ERROR_CODE.ROLE_NOT_ALLOWED, 'authorizeMinRole', { message: 'Faltan permisos para esta accion' }))
      }

      next()
    }

export class Auth {
  static login(req: Request, user: { id: string, email: string, role: UserRole }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!req.session) {
        return reject(middError(ERROR_CODE.UNEXPECTED_ERROR, 'Auth.login', { message: 'Session middleware is not initialized' }))
      }
      const existingCsrfSecret = req.session.csrfSecret ?? csrfTokens.secretSync()
      req.session.regenerate((err) => {
        if (err) return reject(err)
        req.session.user = user
        req.session.csrfSecret = existingCsrfSecret
        req.session.save((saveErr) => {
          if (saveErr) return reject(saveErr)
          resolve()
        })
      })
    })
  }

  static logout(req: Request): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!req.session) {
        return resolve()
      }
      req.session.destroy((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  static getSessionUser(req: Request) {
    return req.session?.user ?? null
  }
}
`
},
{
    path:`/${options.sourceFolderName}/shared/auth/testHelpers/serverTest.help.ts`,
    file: `import express from 'express'
import { sessionMiddleware } from '../session.js'
import { csrfProtection, setCsrfToken, verifyCsrfToken, isAuthenticated, authorize, UserRole, Auth } from '../authMiddlewares.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from '../../../configs/errors.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(csrfProtection)   // inicializa req.session.csrfSecret
app.use(setCsrfToken)     // escribe cookie XSRF-TOKEN
app.use(verifyCsrfToken)  // bloquea mutantes sin token válido

app.post('/login', (req, res) => {
  const { user } = req.body
  Auth.login(req, user)
  res.status(200).json({ success: true, message: 'Logged in' })
})

app.post('/logout', async(req, res) => {
  await Auth.logout(req)
  res.status(200).json({ success: true, message: 'Logged out' })
})

app.get('/csrf', (req, res) => {
  res.status(200).json({ success: true, message: 'CSRF token set' })
})

app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ success: true, message: 'Passed middleware', user: req.session.user })
})

app.get('/admin', authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({ success: true, message: 'Passed middleware' })
})

// Debe ir al final, igual que en app.ts
app.use(errorHandler)

export default app`
},{
    path:`/${options.sourceFolderName}/shared/auth/session/types.ts`,
    file: `import type { SessionData } from 'express-session'

export interface DefaultFields {
  data: string;
  expires: Date;
  [key: string]: unknown;
}

export interface ISessionAdapter {
  get(sid: string): Promise<{ sid: string; expires: Date; data: string; [key: string]: unknown } | null>;
  set(sid: string, defaults: DefaultFields): Promise<void>;
  touch(sid: string, expires: Date): Promise<void>;
  destroy(sid: string): Promise<void>;
  length(): Promise<number>;
  clearExpiredSessions(now?: Date): Promise<void>;
}

export interface SessionStoreOptions {
  adapter: ISessionAdapter;
  checkExpirationInterval?: number;
  expiration?: number;
  disableTouch?: boolean;
  extendDefaultFields?: (defaults: DefaultFields, session: SessionData) => DefaultFields;
}
`
},
{
    path:`/${options.sourceFolderName}/shared/auth/session/connect-session-app.ts`,
    file: `//import createDebug from 'debug'
import { Store, type SessionData } from 'express-session'
import type { ISessionAdapter, SessionStoreOptions, DefaultFields } from './types.js'

//const debug = createDebug('connect:session')

const defaultOptions = {
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
  disableTouch: false
}

function promisify<T>(promise: Promise<T>, fn?: (err: unknown, data?: T) => void): Promise<T> {
  if (typeof fn === 'function') {
    promise
      .then((result) => fn(null, result))
      .catch((err) => fn(err || new Error('Session store error')))
  }
  return promise
}

export class DbSessionStore extends Store {
  public options: Required<SessionStoreOptions>
  public adapter: ISessionAdapter
  private _expirationInterval: NodeJS.Timeout | null = null

  constructor(options: SessionStoreOptions) {
    super()
    this.options = { ...defaultOptions, ...(options || {}) } as any

    if (!this.options.adapter) {
      throw new Error('adapter (ISessionAdapter) instance is required for DbSessionStore')
    }
    this.adapter = this.options.adapter

    this.startExpiringSessions()
  }


  get(sid: string, fn?: (err: unknown, session?: SessionData | null) => void) {
    //debug('GET "%s"', sid)
    const promise = this.adapter.get(sid).then((record) => {
      if (!record) return null
      return JSON.parse(record.data) as SessionData
    })
    return promisify(promise, fn)
  }

  set(sid: string, data: SessionData, fn?: (err?: unknown, session?: unknown) => void) {
    //debug('SET "%s"', sid)
    const stringData = JSON.stringify(data)
    const expires = this.expiration(data)

    let defaults: DefaultFields = { data: stringData, expires }
    if (this.options.extendDefaultFields) {
      defaults = this.options.extendDefaultFields(defaults, data)
    }

    const promise = this.adapter.set(sid, defaults)
    return promisify(promise, fn)
  }

  touch(sid: string, data: SessionData, fn?: (err?: unknown) => void) {
    //debug('TOUCH "%s"', sid)
    if (this.options.disableTouch) {
      if (typeof fn === 'function') fn()
      return Promise.resolve()
    }
    const expires = this.expiration(data)
    const promise = this.adapter.touch(sid, expires)
    return promisify(promise, fn)
  }

  destroy(sid: string, fn?: (err?: unknown) => void) {
    //debug('DESTROY "%s"', sid)
    const promise = this.adapter.destroy(sid)
    return promisify(promise, fn)
  }

  length(fn?: (err: unknown, count?: number) => void) {
    const promise = this.adapter.length()
    return promisify(promise, fn)
  }

  clearExpiredSessions(fn?: (err?: unknown) => void) {
    //debug('CLEARING EXPIRED SESSIONS')
    const promise = this.adapter.clearExpiredSessions(new Date())
    return promisify(promise, fn)
  }

  startExpiringSessions() {
    this.stopExpiringSessions()
    if (this.options.checkExpirationInterval > 0) {
      this._expirationInterval = setInterval(
        () => this.clearExpiredSessions(),
        this.options.checkExpirationInterval
      )
      this._expirationInterval.unref()
    }
  }

  stopExpiringSessions() {
    if (this._expirationInterval) {
      clearInterval(this._expirationInterval)
      this._expirationInterval = null
    }
  }

  expiration(data: SessionData): Date {
    if (data.cookie && data.cookie.expires && !isNaN(new Date(data.cookie.expires).getTime())) {
      return new Date(data.cookie.expires)
    }
    return new Date(Date.now() + this.options.expiration)
  }
}

export default DbSessionStore
`
},
{
    path:`/${options.sourceFolderName}/shared/auth/session/connect-db.ts`,
    file: `${dbSnippet.file}`
},
{
    path:`/${options.sourceFolderName}/features/auth/AuthService.ts`,
    file: `import { userService } from '../../shared/dependencies.js'


export class AuthService {
  async login(email: string, password: string) {
    return await userService.login(email, password)
    
  }
}`
},
{
    path:`/${options.sourceFolderName}/features/auth/AuthController.ts`,
    file: `import type { Request, Response, NextFunction } from 'express'
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
},
{
    path:`/${options.sourceFolderName}/features/auth/auth.routes.ts`,
    file: `import express from 'express'
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
},
{
    path:`/${options.sourceFolderName}/features/auth/auth.integration.test.ts`,
    file: `import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import session from 'supertest'
import serverAuth, {
  testUsersSeed,
  mockUser,
  mockAdmin,
  mockDisabled,
  getUserid
} from './testHelpers/serverAuth.help.js'
import { startUp, closeDatabase } from '../../configs/database.js'

function getCsrfToken(res: any): string {
  const setCookie = res.get('Set-Cookie')
  if (!setCookie) return ''
  const csrfCookie = setCookie.find((c: string) => c.includes('XSRF-TOKEN'))
  if (!csrfCookie) return ''
  const rawToken = csrfCookie.split('=')[1].split(';')[0]
  return decodeURIComponent(rawToken)
}

describe('Auth Integration Tests', () => {
  beforeAll(async() => {
    ${select}
    await testUsersSeed()
  })

  afterAll(async() => {
    await closeDatabase()
  })

  describe('1. CSRF Protection Integration', () => {
    it('should generate an XSRF-TOKEN cookie on initial GET request', async() => {
      const agent = session.agent(serverAuth)
      const res = await agent.get('/test/csrf')
      expect(res.status).toBe(200)
      expect(res.body.ok).toBe(true)

      const token = getCsrfToken(res)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })

    it('should reject POST /test/login if x-csrf-token header is missing', async() => {
      const agent = session.agent(serverAuth)
      await agent.get('/test/csrf')

      const res = await agent.post('/test/login').send(mockUser)
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })

    it('should reject POST /test/login if x-csrf-token header is invalid', async() => {
      const agent = session.agent(serverAuth)
      await agent.get('/test/csrf')

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', 'invalid-token-12345')
        .send(mockUser)

      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })

    it('should accept POST /test/login when valid x-csrf-token is provided', async() => {
      const agent = session.agent(serverAuth)
      const csrfRes = await agent.get('/test/csrf')
      const token = getCsrfToken(csrfRes)

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send(mockUser)

      expect(res.status).toBe(200)
      expect(res.body.email).toBe(mockUser.email)
    })

    it('should reject POST /test/login if x-csrf-token is passed via query string', async() => {
      const agent = session.agent(serverAuth)
      const csrfRes = await agent.get('/test/csrf')
      const token = getCsrfToken(csrfRes)

      const res = await agent.post(\`/test/login?_csrf=\${token}\`).send(mockUser)
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })
  })

  describe('2. Authentication Flow (/login, /me, /logout)', () => {

    it('should login successfully with valid credentials and set session cookies', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send(mockUser)

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        id: getUserid(),
        email: mockUser.email,
        role: 'USER'
      })

      const setCookies = res.get('Set-Cookie')
      expect(setCookies).toBeDefined()
      expect(setCookies!.some((c: string) => c.includes('logged_in=true'))).toBe(true)
      expect(setCookies!.some((c: string) => c.includes('app.sid='))).toBe(true)
    })

    it('should return session user info on GET /test/me when authenticated', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      await agent.post('/test/login').set('x-csrf-token', token).send(mockUser)

      const meRes = await agent.get('/test/me')
      expect(meRes.status).toBe(200)
      expect(meRes.body).toEqual({
        id: getUserid(),
        email: mockUser.email,
        role: 'USER'
      })
    })

    it('should deny GET /test/me when not authenticated', async() => {
      const agent = session.agent(serverAuth)
      const res = await agent.get('/test/me')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('ACCESS_DENIED')
    })

    it('should logout successfully, clear cookies and destroy session', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      await agent.post('/test/login').set('x-csrf-token', token).send(mockUser)

      const checkBefore = await agent.get('/test/me')
      expect(checkBefore.status).toBe(200)

      const logoutRes = await agent.post('/test/logout').set('x-csrf-token', token)
      expect(logoutRes.status).toBe(200)
      expect(logoutRes.body).toBe('Sesión cerrada')

      const checkAfter = await agent.get('/test/me')
      expect(checkAfter.status).toBe(403)
      expect(checkAfter.body.ok).toBe(false)
      expect(checkAfter.body.code).toBe('ACCESS_DENIED')
    })
  })

  describe('3. Permissions & RBAC Authorization', () => {
    it('should allow normal USER to access isAuthenticated protected route', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      await agent.post('/test/login').set('x-csrf-token', token).send(mockUser)

      const res = await agent.get('/test/protected')
      expect(res.status).toBe(200)
      expect(res.body.ok).toBe(true)
      expect(res.body.user.role).toBe('USER')
    })

    it('should deny USER access to admin-only route (/test/admin-only)', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      await agent.post('/test/login').set('x-csrf-token', token).send(mockUser)

      const res = await agent.get('/test/admin-only')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('FORBIDDEN')
    })

    it('should deny USER access to min-admin route (/test/min-admin)', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      await agent.post('/test/login').set('x-csrf-token', token).send(mockUser)

      const res = await agent.get('/test/min-admin')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('ROLE_NOT_ALLOWED')
    })

    it('should allow ADMIN user to access admin-only and min-admin routes', async() => {
      const adminAgent = session.agent(serverAuth)
      const initRes = await adminAgent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      const loginRes = await adminAgent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send(mockAdmin)

      expect(loginRes.status).toBe(200)
      expect(loginRes.body.role).toBe('ADMIN')

      const adminOnlyRes = await adminAgent.get('/test/admin-only')
      expect(adminOnlyRes.status).toBe(200)
      expect(adminOnlyRes.body.ok).toBe(true)

      const minAdminRes = await adminAgent.get('/test/min-admin')
      expect(minAdminRes.status).toBe(200)
      expect(minAdminRes.body.ok).toBe(true)
    })

    it('should deny unauthenticated user access to protected and admin routes', async() => {
      const unauthAgent = session.agent(serverAuth)

      const resProtected = await unauthAgent.get('/test/protected')
      expect(resProtected.status).toBe(401)
      expect(resProtected.body.code).toBe('UNAUTHORIZED')

      const resAdmin = await unauthAgent.get('/test/admin-only')
      expect(resAdmin.status).toBe(401)
      expect(resAdmin.body.code).toBe('UNAUTHORIZED')
    })
  })

  describe('4. Corner Cases & Edge Cases', () => {
    it('should fail login when password is incorrect with error code INVALID_CREDENTIALS', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send({ email: mockUser.email, password: 'WrongPassword123' })

      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('should fail login when user email does not exist with identical INVALID_CREDENTIALS code', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send({ email: 'nonexistent@domain.com', password: 'L1234567' })

      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('should fail login when user account is disabled with identical INVALID_CREDENTIALS code', async() => {
      const agent = session.agent(serverAuth)
      const initRes = await agent.get('/test/csrf')
      const token = getCsrfToken(initRes)

      const res = await agent
        .post('/test/login')
        .set('x-csrf-token', token)
        .send(mockDisabled)

      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })



    it('should handle session isolation between different agents', async() => {
      const agent1 = session.agent(serverAuth)
      const agent2 = session.agent(serverAuth)

      const csrf1 = getCsrfToken(await agent1.get('/test/csrf'))
      const csrf2 = getCsrfToken(await agent2.get('/test/csrf'))

      await agent1.post('/test/login').set('x-csrf-token', csrf1).send(mockUser)
      await agent2.post('/test/login').set('x-csrf-token', csrf2).send(mockAdmin)

      const res1 = await agent1.get('/test/admin-only')
      expect(res1.status).toBe(403)

      const res2 = await agent2.get('/test/admin-only')
      expect(res2.status).toBe(200)
    })
  })
})
`
},
{
    path:`/${options.sourceFolderName}/features/auth/testHelpers/serverAuth.help.ts`,
    file: `import express from 'express'
import cookieParser from 'cookie-parser'
import * as eh from '../../../configs/errors'
import { sessionMiddleware } from '../../../shared/auth/Session.js'
import {
  csrfProtection,
  setCsrfToken,
  verifyCsrfToken,
  isAuthenticated,
  authorize,
  authorizeMinRole,
  UserRole,
  Auth
} from '../../../shared/auth/authMiddlewares.js'
import { userService } from '../../../shared/dependencies'
import authRouter from '../auth.routes.js'

const serverAuth = express()
serverAuth.use(express.json())
serverAuth.use(cookieParser())
serverAuth.use(sessionMiddleware)

// CSRF Middlewares
serverAuth.use(csrfProtection)
serverAuth.use(setCsrfToken)
serverAuth.use(verifyCsrfToken)

// Helper endpoint for CSRF token initialization
serverAuth.get('/test/csrf', (req, res) => {
  res.status(200).json({ ok: true, message: 'CSRF token initialized' })
})

// Main Auth Routes (/test/login, /test/logout, /test/me)
serverAuth.use('/test', authRouter)

// Aux routes to test permissions & RBAC
serverAuth.get('/test/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ ok: true, message: 'Passed isAuthenticated', user: Auth.getSessionUser(req) })
})


serverAuth.get('/test/admin-only', authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({ ok: true, message: 'Passed authorize ADMIN' })
})

serverAuth.get('/test/min-admin', authorizeMinRole(UserRole.ADMIN), (req, res) => {
  res.status(200).json({ ok: true, message: 'Passed authorizeMinRole ADMIN' })
})

serverAuth.use(eh.errorHandler)
export default serverAuth

export const mockUser = { email: 'usertest@gmail.com', password: 'L1234567' }
export const mockAdmin = { email: 'admintest@gmail.com', password: 'L1234567' }
export const mockDisabled = { email: 'disabledtest@gmail.com', password: 'L1234567' }


let userId: string
let adminId: string
let disabledId: string

export async function testUsersSeed() {
  const userCreated = await userService.registerUser(mockUser)
  userId = userCreated.id

  const adminCreated = await userService.registerUser(mockAdmin)
  adminId = adminCreated.id
  await userService.upgradeUser(adminId, { role: 'ADMIN', enabled: true })

  const disabledCreated = await userService.registerUser(mockDisabled)
  disabledId = disabledCreated.id
  await userService.upgradeUser(disabledId, { role: 'USER', enabled: false })
}

export const getUserid = (): string => userId
export const getAdminid = (): string => adminId
export const getDisabledid = (): string => disabledId`
},
        
    ]
}