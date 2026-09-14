import type { FilePattern } from "../../types.js"
import { appSnippet, authDependencies } from "../auth/auth.snippets.js"

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
file: `import express from 'express'
import { loggerServiceDb } from '../../configs/logger/LoggerServiceDb.js'
import { LoggerController } from '../../configs/logger/LoggerController.js'
import { Validator } from 'req-valid-express'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'
import logQuery from './logSchema.js'

const logger = new LoggerController(loggerServiceDb)

const logRouter = express.Router()

logRouter.get(
    '/',
    Validator.validateQuery(logQuery,{
    searchField: ['levelName', 'message', 'status'],
    sortBy: ['id', 'time', 'createdAt'],
    order:['ASC', 'DESC']
    }),
    logger.getAll
)

logRouter.get(
    '/:id', 
    Validator.paramId('id', UuidHandler.uuidRegex),
    logger.getById)

logRouter.patch(
    '/:id', 
    Validator.paramId('id', UuidHandler.uuidRegex),
    Validator.validateBody({keep:{type:'boolean'}}),
    logger.update)

logRouter.delete(
    '/:id', 
    Validator.paramId('id', UuidHandler.uuidRegex),
    logger.delete)

logRouter.delete(
    '/:id/clean',
    Validator.paramId('id', UuidHandler.uuidRegex),
    logger.deleteAll)

export default logRouter`
},
{
    path:`/${options.sourceFolderName}/features/system-logs/logSchema.ts`,
    file: `import type { Schema } from "req-valid-express";

const logquery: Schema = {
  page: {
    type: "int",
    default: 1
  },
  limit: {
    type: "int",
    default: 5
  },
  searchField: {
    type: "string",
    default: "levelName",
    sanitize: {
      trim: true
    }
  },
  search: {
    type: "string",
    default: "",
    sanitize: {
      trim: true
    }
  },
  sortBy: {
    type: "string",
    default: "id",
    sanitize: {
      trim: true
    }
  },
  order: {
    type: "string",
    default: "ASC",
    sanitize: {
      trim: true
    }
  }
};

export default logquery;`
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
    file: `import express from 'express'
import { UserController } from './UserController.js'
import { userService } from '../../shared/dependencies.js'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'
import { Validator } from 'req-valid-express'
import * as sch from './userSchema.js'

const controller = new UserController(userService)
const userRouter = express.Router()
userRouter.get(
  '/',
  controller.getAll
)
userRouter.get(
  '/:userId',
  Validator.paramId('userId',UuidHandler.uuidValidator),
  controller.getById
)
userRouter.post(
  '/',
  Validator.validateBody(sch.createUser),
  controller.create
)
userRouter.put(
  '/:userId',
  Validator.paramId('userId',UuidHandler.uuidValidator),
  Validator.validateBody(sch.updateProfile),
  controller.updateProfile
)
userRouter.delete(
  '/:userId',
  Validator.paramId('userId',UuidHandler.uuidValidator),
  controller.delete
)
userRouter.post(
  '/update-credentials',
  Validator.validateBody(sch.changePassword),
  controller.changePassword
)
userRouter.patch(
  '/:userId/assign-status',
   Validator.paramId('userId',UuidHandler.uuidValidator),
  Validator.validateBody(sch.upgradeUser),
  controller.userUpgrade
)

export default userRouter
`
},
{
    path:`/${options.sourceFolderName}/features/user/UserController.ts`,
    file:`import { type Request, type Response, type NextFunction } from 'express'
import { responder } from '../../shared/utils/responder.js'
import type { userService } from '../../shared/dependencies.js'

type UserServiceType = typeof userService

export class UserController{
  constructor(
       private service: UserServiceType
  ){}
  getAll = async(req:Request, res:Response) => {
    const response = await this.service.getAllUsers()
    return responder(res, 200, response)
  }
  getById = async(req:Request, res:Response) => {
    const { userId } = req.params
    const response = await this.service.getUserById(userId as string)
    return responder(res, 200, response)
  }
  create = async(req:Request, res:Response) => {
    const data = req.body
    const response = await this.service.registerUser(data)
    return responder(res, 201, response )
  }
  updateProfile = async(req:Request, res:Response) => {
    const { userId } = req.params
    const data = req.body
    const response = await this.service.updateProfile(userId as string, data)
    return responder(res, 200, response )
  }
  userUpgrade = async(req:Request, res:Response) => {
    const { userId } = req.params
    const data = req.body
    const response = await this.service.upgradeUser(userId as string, data)
    return responder(res, 200,response )
  }
  changePassword = async(req:Request, res:Response) => {
    const data = req.body
    const response = await this.service.changePassword(data)
    return responder(res, 200, response)
  }

  delete = async(req:Request, res:Response) => {
    const { userId } = req.params
    const response = await this.service.deleteUser(userId as string)
    return responder(res, 200, response )
  }
}`
},
{
    path:`/${options.sourceFolderName}/features/user/userSchema.ts`,
    file:`import { Schema } from 'req-valid-express'

export const createUser:Schema = {
  email:{
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  password:{
      type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const updateProfile:Schema = {
  email:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  name:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  nickname:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  picture: {
        type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const changePassword:Schema={
  id:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  password:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  newPassword:{
        type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const upgradeUser:Schema = {
  role:{
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  enabled: {
        type: 'boolean',

  }
}`
}

]
}
