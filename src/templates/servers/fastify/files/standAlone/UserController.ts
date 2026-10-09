export const userController = `import type { FastifyRequest, FastifyReply } from 'fastify'
import { responder } from '../../shared/utils/responder.js'
import type { IGenericService, TCreate, TUpdate } from './user.interface.js'

type UserParams = { id: string }

export class UserController<
  TEntity,
  TCreateDto = TCreate<TEntity>,
  TUpdateDto = TUpdate<TEntity>,
> {
  protected service: IGenericService<TEntity, TCreateDto, TUpdateDto>

  constructor(service: IGenericService<TEntity, TCreateDto, TUpdateDto>) {
    this.service = service
  }

  getAll = async(request: FastifyRequest, reply: FastifyReply) => {
    const response = await this.service.getAll()
    return responder(reply, 200, response)
  }

  getById = async(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params
    const response = await this.service.getById(id)
    return responder(reply, 200, response)
  }

  create = async(
    request: FastifyRequest<{ Body: TCreateDto }>,
    reply: FastifyReply
  ) => {
    const data = request.body as TCreateDto
    const response = await this.service.create(data)
    return responder(reply, 201, response)
  }

  update = async(
    request: FastifyRequest<{ Params: UserParams; Body: TUpdateDto }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params
    const newData = request.body as TUpdateDto
    const response = await this.service.update(id, newData)
    responder(reply, 200, response)
  }

  delete = async(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params
    const response = await this.service.delete(id)
    responder(reply, 200, response)
  }
}
`
