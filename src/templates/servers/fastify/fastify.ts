import type { ProjectConfig } from "../../../types.js"
import * as dep from './files/index.js'
import * as depSA from './files/standAlone/index.js'
import { fastifyAuthSnippet } from "./snippets/auth.snippets.js"

export const fastify = (options:ProjectConfig)=>{
 const files =[

{
    //Crear el archivo app.ts en src
path: `/${options.sourceFolderName}/app.ts`,
file:`import Fastify from 'fastify'
import * as conf from './configs/serverConfig.js'
import logger from './configs/logger.js'
import { errorHandler, notFoundHandler } from './configs/errors.js'
import userRouter from './features/user/user.routes.js'${(options.selectedOrm !== 'none')?"\nimport logRouter from './features/system-logs/log.routes.js'": ""}
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.importFeature : ''}
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.import : ''}

const fastify = Fastify({
  loggerInstance: logger,
  ajv: { customOptions: conf.ajvOptions }
})

fastify.setErrorHandler(errorHandler)
fastify.setNotFoundHandler(notFoundHandler)

${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.line : ''}
await fastify.register(userRouter, { prefix: '/api/v1/user' })
${(options.selectedAuth !== 'auth-null')?fastifyAuthSnippet.lineFeature: ''}${(options.selectedOrm !== 'none')?"\nawait fastify.register(logRouter, { prefix: '/api/v1/logs' })": ""}


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


]
const filesWithDb = [
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
},
        {
path:`/${options.sourceFolderName}/features/system-logs/log.routes.ts`,
file: dep.logRouter
},
{
    path:`/${options.sourceFolderName}/features/system-logs/logSchema.ts`,
    file: dep.logSchema
},
]
const filesStandAlone = [
            {
                path:`/${options.sourceFolderName}/features/user/user.routes.ts`,
                file: depSA.userRouter
            },
            {
                path:`/${options.sourceFolderName}/features/user/UserController.ts`,
                file: depSA.userController
            },
            {
                path:`/${options.sourceFolderName}/features/user/schemas.ts`,
                file: depSA.schemas
            },
            {
                path:`/${options.sourceFolderName}/features/user/user.interface.ts`,
                file: depSA.userInterfaces
            },
            {
                path:`/${options.sourceFolderName}/features/user/UserService.ts`,
                file: depSA.userService
            },
            {
                path:`/${options.sourceFolderName}/features/user/users.ts`,
                file: depSA.users
            }
]
    options.selectedOrm !== 'none'
        ? filesWithDb.map(obj => files.push(obj))
        : filesStandAlone.map(obj => files.push(obj))
return files 
}
