import type { FilePattern } from "../../../types.js"
import * as dep from './common/index.js'
import { fastifyAuthSnippet } from "./snippets/auth.snippets.js"

export const fastify = (options:FilePattern)=>{
 const files =[

{
    //Crear el archivo app.ts en src
path: `/${options.sourceFolderName}/app.ts`,
file:`import Fastify from 'fastify'
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.import : ''}
import * as conf from './configs/serverConfig.js'
import logger from './configs/logger.js'
import { errorHandler, notFoundHandler } from './configs/errors.js'
import userRouter from './features/user/user.routes.js'
import logRouter from './features/system-logs/log.routes.js'
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.importFeature : ''}

const fastify = Fastify({
  loggerInstance: logger,
  ajv: { customOptions: conf.ajvOptions }
})

fastify.setErrorHandler(errorHandler)
fastify.setNotFoundHandler(notFoundHandler)

${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.line : ''}
await fastify.register(userRouter, { prefix: '/api/v1/user' })
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.lineFeature: ''}
await fastify.register(logRouter, { prefix: '/api/v1/logs' })

export default fastify
`},
{
path:`/${options.sourceFolderName}/index.ts`,
file:`import fastify from './app.js'${options.selectedOrm !== 'none'?`\nimport { startUp } from './configs/database.js'`:''}
import envConfig from './configs/envConfig.js'

const message =\`Server is listening on port \${envConfig.Port}\\nServer in \${envConfig.Status}\\n 🚀​ Everything is allright!!\`
async function serverBootstrap(){
    try{${options.selectedOrm !== 'none'?`\n      await startUp()`:''}
        await fastify.listen({port: envConfig.Port})
        console.log(message)
    }catch(error){
        console.error('Error initializing server: ',error)
        fastify.log.error(error)
        process.exit(1)
    }
}
serverBootstrap()`
        },
        {
path:`/${options.sourceFolderName}/configs/serverConfig.ts`,
file: dep.serverConfig
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
  file: `import type { FastifyReply } from 'fastify';

export function responder(
  reply: FastifyReply,
  status: number,
  data: any
) {
  return reply.status(status).send(data)
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
return files 
}
