import { throwError, processError, ERROR_CODE } from '../errors.js'
import { eq, ilike, desc, asc, count } from 'drizzle-orm'
import { type ILogger, type LoggerUpdate, type LoggerCreate, type ILoggerService, type IPagesOptions, type IActionResponse, type IPaginatedResponse } from './Logger.interfaces.js'
import { db } from '../database.js'
import { log, type LogLevel } from '../../schemas/index.schemas.js'


export class LoggerServiceDb implements ILoggerService<ILogger, LoggerUpdate> {

  constructor() {}

  /**
   * Parse Drizzle row → ILogger
   */
  private readonly parserFn = (u: any): ILogger => {
    return {
      id: u.id,
      levelName: u.levelName,
      levelCode: u.levelCode,
      message: u.message, 
      type: u.type ?? null,
      stack: u.stack ?? null, 
      contexts: u.context ?? [],
      pid: u.pid,
      time: Number(u.time),
      hostname: u.hostname,
      keep: u.keep,
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString()
    }
  }
   /**
   * Create new log record
   */
  async create (data: LoggerCreate): Promise<ILogger> {
    try {
      const record = await db.insert(log).values(data as any)
      return this.parserFn(record)
    } catch (error) {
      return processError(error, 'Log create')
    }
  }

  /**
   * Get paginated results
   */
  async getAll(options: IPagesOptions<ILogger> = {}): Promise<IPaginatedResponse> {
    try {
      const {
        searchField = '',
        search = null,
        sortBy = 'logId',
        order = 'DESC',
        page = 1,
        limit = 10
      } = options

      const offset = (page - 1) * limit

      let whereClause = undefined
      const dbSearchField = searchField as string
      const dbSortField = sortBy as string

      if (search && dbSearchField && dbSearchField in log) {
        // @ts-ignore
        whereClause = ilike(log[dbSearchField], `%${search}%`)
      }

      // Query para obtener el total
      const totalQuery = await db
        .select({ count: count() })
        .from(log)
        .where(whereClause)
      
      const total = totalQuery[0].count

      // Query para obtener los resultados
      const orderDirection = order.toUpperCase() === 'ASC' ? asc : desc
      // @ts-ignore
      const sortColumn = log[dbSortField] ?? log.logId

      const existingRecords = await db
        .select()
        .from(log)
        .where(whereClause)
        .orderBy(orderDirection(sortColumn))
        .limit(limit)
        .offset(offset)

      return {
        info: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: existingRecords.map(this.parserFn)
      }
    } catch (error) {
      return processError(error, 'LoggerServiceDb getAll') 
    }
  }

  /**
   * Get single log by ID
   */
  async getById(id: string): Promise<ILogger> {
    try {
      const records = await db
        .select()
        .from(log)
        .where(eq(log.id, id))
        .limit(1)
      const record = records[0]

      if (!record) {
        throwError(ERROR_CODE.NOT_FOUND, `Log con logId ${id} no encontrado`)
      }

      return this.parserFn(record)
    } catch (error) {
      return processError(error, 'LoggerServiceDb getById')
    }
  }

  /**
   * Update keep flag or other allowed fields
   */
  async update(id: string, data: LoggerUpdate): Promise<IActionResponse> {
    try {
      const records = await db
        .update(log)
        .set(data as any)
        .where(eq(log.id, id))
        .returning()
      
      const record = records[0]

      if (!record) {
        throwError(ERROR_CODE.NOT_FOUND, `Log con logId ${id} no encontrado`)
      }

      return {
        message: 'Log actualizado correctamente',
        data: this.parserFn(record)
      }
    } catch (error) {
      return processError(error, 'LoggerServiceDb update')
    }
  }

  /**
   * Delete single log
   */
  async delete(id: string): Promise<string> {
    try {
      const records = await db
        .delete(log)
        .where(eq(log.id, id))
        .returning()

      if (records.length === 0) {
        throwError(ERROR_CODE.NOT_FOUND, `Log con logId ${id} no encontrado`)
      }

      return 'Log eliminado correctamente' 
    } catch (error) {
      return processError(error, 'Log deleted')
    }
  }

  /**
   * Delete all logs except those marked as keep = true
   */
  async deleteAll(): Promise<string|void> {
    try {
      await db
        .delete(log)
        .where(eq(log.keep, false))

      return 'Logs eliminados correctamente'
    } catch (error) {
      return processError(error, 'LoggerServiceDb deleteAll')
    }
  }
}
export const loggerServiceDb = new LoggerServiceDb()
  