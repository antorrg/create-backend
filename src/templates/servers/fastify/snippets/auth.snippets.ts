
export const fastifyAuthSnippet = {
    import:`import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { sessionConfig } from './shared/auth/session.js'
import { csrfProtection, setCsrfToken, verifyCsrfToken } from './shared/auth/authMiddlewares.js'
import fastifyCors from '@fastify/cors'`,
    importFeature: `import authRouter from './features/auth/auth.routes.js'`,
    line: `await fastify.register(fastifyCors, { origin: true, credentials: true })
await fastify.register(fastifyCookie)
await fastify.register(fastifySession, sessionConfig)

fastify.addHook('preHandler', csrfProtection)
fastify.addHook('preHandler', setCsrfToken)
fastify.addHook('preHandler', verifyCsrfToken)`,
    lineFeature: `await fastify.register(authRouter, { prefix: '/api/v1/auth' })`
}

export const fastifyAuthDependencies = {
    dep: `,
    "@fastify/session": "^11.1.2",`,
    devDep: ``,
    envLine:`SESSION_SECRET=`,
    envConfigLine:"SessionSecret: getStringEnv('SESSION_SECRET'),"
}
