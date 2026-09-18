/**
 * integrationTest1 
 * integrationTest2 
 * featureTestHelper 
 */
export const integrationTest1 = `import { describe, it, expect, beforeAll, afterAll } from 'vitest'
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
}`

export const integrationTest2 = ` afterAll(async() => {
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
export const featureTestHelper = `import express from 'express'
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