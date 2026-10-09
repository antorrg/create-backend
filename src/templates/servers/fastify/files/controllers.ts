
export const userController = `import type { FastifyRequest, FastifyReply } from 'fastify'
import { responder } from '../../shared/utils/responder.js'
import type { userService } from '../../shared/dependencies.js'
import * as sch from './userSchema.js'

type UserServiceType = typeof userService
type UserParams = { userId: string }

export class UserController{
  constructor(
       private service: UserServiceType
  ){}
  getAll = async(request: FastifyRequest, reply: FastifyReply) => {
    const response = await this.service.getAllUsers()
    return responder(reply, 200, response)
  }
  getById = async(
    request: FastifyRequest<{Params: UserParams}>, 
    reply: FastifyReply
  ) => {
    const { userId } = request.params
    const response = await this.service.getUserById(userId as string)
    return responder(reply, 200, response)
  }
  create = async(
    request: FastifyRequest<{Body: sch.CreateUser}>, 
    reply: FastifyReply
  ) => {
    const data = request.body
    const response = await this.service.registerUser(data)
    return responder(reply, 201, response)
  }
  updateProfile = async(
    request: FastifyRequest<{Params: UserParams, Body: sch.UpdateProfile}>, 
    reply: FastifyReply
  ) => {
    const { userId } = request.params
    const data = request.body
    const response = await this.service.updateProfile(userId, data)
    return responder(reply, 200, response )
  }
  userUpgrade = async(
    request: FastifyRequest<{Params: UserParams, Body: sch.UpgradeUser}>, 
    reply: FastifyReply
  ) => {
    const { userId } = request.params
    const data = request.body
    const response = await this.service.upgradeUser(userId as string, data)
    return responder(reply, 200,response )
  }
  changePassword = async(
    request: FastifyRequest<{Body:sch.ChangePassword}>, 
    reply: FastifyReply
  ) => {
    const data = request.body
    const response = await this.service.changePassword(data)
    return responder(reply, 200, response)
  }

  delete = async(
    request: FastifyRequest<{Params: UserParams}>, 
    reply: FastifyReply
  ) => {
    const { userId } = request.params
    const response = await this.service.deleteUser(userId as string)
    return responder(reply, 200, response )
  }
}`