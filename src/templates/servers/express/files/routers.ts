/**
 * logRouter, userRouter
 */

export const logRouter =`import express from 'express'
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

export const userRouter = `import express from 'express'
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