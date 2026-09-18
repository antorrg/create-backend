
export const expressaAuthSnippet = {
    import:`import cookieParser from 'cookie-parser'
import { sessionMiddleware } from './shared/auth/session.js'
import * as auth from './shared/auth/authMiddlewares.js'`,
    line: `app.use(cookieParser())
app.use(sessionMiddleware)
app.use(auth.csrfProtection)
app.use(auth.setCsrfToken)
app.use(auth.verifyCsrfToken)`
}

export const expressAuthDependencies = {
    dep: `,
    "cookie-parser": "^1.4.7",
    "express-session": "^1.19.0"`,
    devDep: `,
    "@types/cookie-parser": "^1.4.10",
    "@types/express-session": "^1.19.0"`,
    envLine:`SESSION_SECRET=`,
    envConfigLine:"SessionSecret: getStringEnv('SESSION_SECRET'),"
}
