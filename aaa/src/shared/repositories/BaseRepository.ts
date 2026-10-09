import { eq, and, asc, desc, count, type Table } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { db as defaultDb } from '../../configs/database.js'
import type { IBaseRepository, IPaginatedOptions, IPaginatedResults } from '../interfaces/base.interface.js'
import { throwError, ERROR_CODE } from '../../configs/errors.js'

export class BaseRepository<
  TDTO,
  TCreate extends Record<string, any>,
  TUpdate = Partial<TCreate>,
  TTable extends Table = any
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor(
    private readonly table: TTable,
    private readonly parserFn: (model: any) => TDTO,
    private readonly modelName: string = 'Model',
    private readonly whereField: keyof TDTO & string = 'id' as any,
    private readonly database: NodePgDatabase<any> = defaultDb
  ) {}

  async getAll(
    field?: unknown,
    whereField?: keyof TDTO | string
  ): Promise<TDTO[]> {
    const targetField = (whereField ?? this.whereField) as string
    const column = (this.table as any)[targetField]

    if (field !== undefined && field !== null && column) {
      const records = await this.database
        .select()
        .from(this.table as any)
        .where(eq(column, field))
      return records.map(this.parserFn)
    }

    const records = await this.database
      .select()
      .from(this.table as any)
    return records.map(this.parserFn)
  }

  async getWithPages(
    options?: IPaginatedOptions<TDTO>
  ): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit

    const conditions: any[] = []
    if (options?.query) {
      for (const [key, val] of Object.entries(options.query)) {
        if (val !== undefined && val !== null) {
          const col = (this.table as any)[key]
          if (col) {
            conditions.push(eq(col, val))
          }
        }
      }
    }

    const whereCondition = conditions.length > 0
      ? conditions.reduce((acc, cond) => and(acc, cond))
      : undefined

    const orderClauses: any[] = []
    if (options?.order && Object.keys(options.order).length > 0) {
      for (const [key, dir] of Object.entries(options.order)) {
        const col = (this.table as any)[key]
        if (col) {
          const isAsc = String(dir).toUpperCase() === 'ASC' || dir === 1
          orderClauses.push(isAsc ? asc(col) : desc(col))
        }
      }
    } else {
      const defaultCol = (this.table as any)[this.whereField] ?? (this.table as any)['id']
      if (defaultCol) {
        orderClauses.push(asc(defaultCol))
      }
    }

    let dataQuery = this.database.select().from(this.table as any)
    if (whereCondition) {
      dataQuery = dataQuery.where(whereCondition) as any
    }
    if (orderClauses.length > 0) {
      dataQuery = dataQuery.orderBy(...orderClauses) as any
    }
    dataQuery = dataQuery.limit(limit).offset(skip) as any

    const data = await dataQuery

    let countQuery = this.database.select({ count: count() }).from(this.table as any)
    if (whereCondition) {
      countQuery = countQuery.where(whereCondition) as any
    }
    const countResult = await countQuery
    const total = Number(countResult[0]?.count ?? 0)

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
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    const [record] = await this.database
      .select()
      .from(this.table as any)
      .where(eq(idCol, id))
    if (!record) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    return this.parserFn(record)
  }

  async findByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    if (field == null) {
      throwError(ERROR_CODE.REQUIRED_FIELD_MISSING, `No value provided for ${whereField as string}`)
    }
    const column = (this.table as any)[whereField as string]
    if (!column) return null
    const [record] = await this.database
      .select()
      .from(this.table as any)
      .where(eq(column, field))
    return record ? this.parserFn(record) : null
  }

  async getByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    return this.findByField(field, whereField)
  }

  async create(data: TCreate): Promise<TDTO> {
    const [created] = (await this.database
      .insert(this.table as any)
      .values(data as any)
      .returning()) as any[]
    return this.parserFn(created)
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<TDTO> {
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    await this.getById(id)
    const [updated] = (await this.database
      .update(this.table as any)
      .set(data as any)
      .where(eq(idCol, id))
      .returning()) as any[]
    return this.parserFn(updated)
  }

  async delete(id: string | number): Promise<string> {
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, `${this.modelName} not found`)
    const existing = await this.getById(id)
    const value = (existing as any)[this.whereField] ?? id
    await this.database
      .delete(this.table as any)
      .where(eq(idCol, id))
    return `${value} deleted successfully`
  }
}