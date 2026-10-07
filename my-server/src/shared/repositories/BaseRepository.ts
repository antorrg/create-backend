import type { IBaseRepository, IPaginatedOptions, IPaginatedResults } from '../interfaces/base.interface.js'
import { Model, ModelStatic } from '@sequelize/core'
import { throwError, ERROR_CODE } from '../../configs/errors.js'

export class BaseRepository<
  TDTO,
  TCreate extends Record<string, any>,
  TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor(
    private readonly Model: ModelStatic<Model>,
    private readonly parserFn: (model: any) => TDTO,
    private readonly modelName: string = Model.name ?? 'Model',
    private readonly whereField: keyof TDTO & string = 'id' as keyof TDTO & string,
  ) {}

  async getAll(
    field?: unknown,
    whereField?: keyof TDTO | string
  ): Promise<TDTO[]> {
    const whereClause = whereField != null && field != null
      ? { [whereField]: field }
      : {}
    const models = await this.Model.findAll({ where: whereClause as any })
    return models.map(this.parserFn)
  }

  async getWithPages(
    options?: IPaginatedOptions<TDTO>
  ): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const offset = (page - 1) * limit
    const whereClause = options?.query ?? {}
    const orderClause = options?.order
      ? Object.entries(options.order).map(([field, direction]) => [field, direction])
      : undefined

    const { rows: data, count: total } = await this.Model.findAndCountAll({
      limit,
      offset,
      where: whereClause as any,
      distinct: true,
      order: orderClause as any
    })

    return {
      info: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: data.map(this.parserFn)
    }
  }

  async getById(id: string | number): Promise<TDTO> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    return this.parserFn(model)
  }

  async findByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    if (field == null) throwError(ERROR_CODE.REQUIRED_FIELD_MISSING, `No value provided for ${(whereField as string)}`)
    const model = await this.Model.findOne({
      where: { [whereField]: field } as any
    })
    return model ? this.parserFn(model) : null
  }

  async create(data: TCreate): Promise<TDTO> {
    const model = await this.Model.create(data as any)
    return this.parserFn(model)
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<TDTO> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    const updated = await model.update(data as any)
    return this.parserFn(updated)
  }

  async delete(id: string | number): Promise<string> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    const value = (model as any)[this.whereField] ?? id
    await model.destroy()
    return `${value} deleted successfully`
  }
}