import type { FilePattern } from "../../../types.js"
import { appSnippet, authDependencies } from "../../auth/auth.snippets.js"
import * as dep from './common/index.js'

export const express = (options:FilePattern)=>{
    return[

{
    //Crear el archivo app.ts en src
path: `/${options.sourceFolderName}/app.ts`,
file:`import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import * as eh from './configs/errors.js'
import mainRouter from './routes.js'
import envConfig from './configs/envConfig.js'
${(options.selectedAuth !== 'auth-null')?appSnippet.import : ''}


const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(eh.jsonFormat)${options.swaggerOption?`\n// ⚙️ Importación dinámica solo si está en desarrollo
if (envConfig.Status === 'development') {
  const { default: swaggerUi } = await import('swagger-ui-express')
  const { default: swaggerJsDoc } = await import('swagger-jsdoc')
  const { default: swaggerOptions } = await import('./Shared/Swagger/swaggerOptions.js')

  const swaggerDocs = swaggerJsDoc(swaggerOptions)
  const swaggerUiOptions = {
    swaggerOptions: {
      docExpansion: 'none', // Oculta todas las rutas al cargar
    },
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions))
}\n`: ''}
${(options.selectedAuth !== 'auth-null')?appSnippet.line : ''}
app.use(mainRouter)
app.use(eh.notFoundRoute)
app.use(eh.errorHandler)

export default app
`},
{

    path: `/${options.sourceFolderName}/routes.ts`,
    file: `
import express from 'express'
import userRouter from './features/user/user.routes.js'
import logRouter from './features/system-logs/log.routes.js'
${(options.selectedAuth !== 'auth-null')?`import authRouter from './features/auth/auth.routes.js'\n`: ''}
const mainRouter = express.Router()
${(options.selectedAuth !== 'auth-null')?`\nmainRouter.use('/api/v1/auth', authRouter)\n`: ''}
mainRouter.use('/api/v1/user', userRouter)

mainRouter.use('/api/v1/logs', logRouter)

export default mainRouter
`
},
{
path:`/${options.sourceFolderName}/index.ts`,
file:`import app from './app.js'${options.selectedServer !== 'ex-single'?`\nimport { startUp } from './configs/database.js'`:''}
import envConfig from './configs/envConfig.js'

const message =\`Server is listening on port \${envConfig.Port}\\nServer in \${envConfig.Status}\\n 🚀​ Everything is allright!!\`
async function serverBootstrap(){
    try{${options.selectedServer !== 'ex-single'?`\n      await startUp()`:''}
        app.listen(envConfig.Port,() => {
        console.log(message)
            })
    }catch(error){
        console.error('Error initializing server: ',error)
        process.exit(1)
    }
}
serverBootstrap()`
        },
        {
path:`/${options.sourceFolderName}/features/system-logs/log.routes.ts`,
file: dep.logRouter
},
{
    path:`/${options.sourceFolderName}/features/system-logs/logSchema.ts`,
    file: dep.logSchema
},
{
  path:`/${options.sourceFolderName}/shared/utils/responder.ts`,
  file: `import { type Response } from 'express'

export function responder(
  res:Response,
  status: number,
  data: any
) {
  return res.status(status).json(data)
}`
},
{
    path:`/${options.sourceFolderName}/features/user/user.routes.ts`,
    file: dep.userRouter
},
{
    path:`/${options.sourceFolderName}/features/user/UserController.ts`,
    file: dep.userController
},
{
    path:`/${options.sourceFolderName}/features/user/userSchema.ts`,
    file: dep.userSchema
}

]
}
