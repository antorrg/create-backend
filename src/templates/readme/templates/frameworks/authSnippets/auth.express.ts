import { Auth } from '../main.session.js'


export const authExpress:Auth = {
        part1:`, and Session-based Authentication.`,
        part2:`auth, `,
        part3: `
        
#### Auth Middlewares

Handle session validation, cookie parsing, and CSRF protection (csrfProtection, setCsrfToken, verifyCsrfToken).`,
        part4: `

### Autentication (\`/api/v1/auth\`)

| Method | Endpoint | Description | Authentication | Required Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| \`POST\` | \`/login\` | Log in and create session/token | Public | \`{ email, password }\` |
| \`POST\` | \`/logout\` | User logout & session destruction | Required | None |
| \`GET\` | \`/me\` | Retrieve current session status | Required | None |
`
    }
