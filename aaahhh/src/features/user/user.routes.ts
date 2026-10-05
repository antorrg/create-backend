import express from 'express'
import { userCreate, userUpdate, regexEmail } from './schemas.js'
import { UserController } from './UserController.js'
import { UserService } from './UserService.js'
import { users } from './users.js'
import {Validator} from 'req-valid-express'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'

const userService = new UserService(users)
const userController = new UserController(userService)

const userRouter = express.Router()

userRouter.post(
  '/',
  Validator.validateBody(userCreate),
  Validator.validateRegex(regexEmail,'email','Invalid email format'),
  userController.create
)
userRouter.get('/',
  userController.getAll
)
userRouter.get('/:id',
  Validator.paramId('id', UuidHandler.uuidRegex),
  userController.getById
)
userRouter.put(
  '/:id',
  Validator.paramId('id', UuidHandler.uuidRegex),
  Validator.validateBody(userUpdate),
 Validator.validateRegex(regexEmail,'email','Invalid email format'),
  userController.update
)
userRouter.delete(
  '/:id',
    Validator.paramId('id', UuidHandler.uuidRegex),
  userController.delete
)

export default userRouter