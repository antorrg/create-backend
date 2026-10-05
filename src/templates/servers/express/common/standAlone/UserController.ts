export const userController = `import type { Request, Response } from 'express'
import type { IGenericService, TCreate, TUpdate } from './user.interface.js'
import { responder } from '../../shared/utils/responder.js'

export class UserController<T> {
  protected service: IGenericService<T, TCreate<T>, TUpdate<T>>

  constructor(service: IGenericService<T, TCreate<T>, TUpdate<T>>) {
    this.service = service
  }

  // Methods:


  // Controllers:
  create = async (req: Request, res: Response): Promise<void> => {
    const data = req.body
    const response = await this.service.create(data)
    responder(res, 201, response)
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const response = await this.service.getAll()
    responder(res, 200, response)
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const response = await this.service.getById(id as string)
    responder(res, 200, response)
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const newData = req.body
    const response = await this.service.update(id as string, newData)
    responder(res, 200,response)
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const response = await this.service.delete(id as string)
    responder(res, 200,  response)
  }
}

export default UserController
`
