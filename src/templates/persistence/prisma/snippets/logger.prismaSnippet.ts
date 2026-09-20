

export const loggerServiceDbPrisma ={
  importType: `'../../../generated/prisma/enums.js'`,
  file:`import { throwError, processError, ERROR_CODE } from '../errors.js'
import { prisma } from '../database.js'
import { LogLevel } from '../../../generated/prisma/enums.js'
import type { Prisma, Log, PrismaClient } from '../../../generated/prisma/client.js'
import {
  type ILogger,
  type LoggerUpdate,
  type ILoggerService,
  type IPagesOptions,
  type IActionResponse,
  type IPaginatedResponse
} from './Logger.interfaces.js'

export { LogLevel }

export class LoggerServiceDb implements ILoggerService<ILogger, LoggerUpdate> {
  protected get Model (): PrismaClient['log'] {
    return prisma.log
  }

  /**
   * Parse Prisma Log instance → ILogger
   */
  private readonly parserFn = (log: Log): ILogger => {
    return {
      id: log.id,
      levelName: log.levelName,
      levelCode: log.levelCode,
      message: log.message,
      type: log.type ?? null,
      status: null,
      stack: log.stack ?? null,
      contexts: log.context ?? [],
      pid: log.pid,
      time: Number(log.time),
      hostname: log.hostname || '',
      keep: log.keep,
      createdAt: log.createdAt?.toISOString(),
      updatedAt: log.updatedAt?.toISOString()
    }
  }

  /**
   * Get paginated results
   */
  async getAll (options: IPagesOptions<ILogger> = {}): Promise<IPaginatedResponse> {
    try {
      const {
        searchField = '',
        search = null,
        sortBy = 'id',
        order = 'DESC',
        page = 1,
        limit = 10
      } = options

      const skip = (page - 1) * limit

      const whereClause: Prisma.LogWhereInput =
        search && searchField
          ? { [searchField]: { contains: search, mode: 'insensitive' } }
          : {}

      const orderDirection = String(order).toLowerCase() === 'asc' ? 'asc' : 'desc'

      const [existingRecords, total] = await Promise.all([
        this.Model.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: orderDirection
          }
        }),
        this.Model.count({ where: whereClause })
      ])

      return {
        info: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: existingRecords.map(r => this.parserFn(r))
      }
    } catch (error) {
      return processError(error, 'Log getAll')
    }
  }

  /**
   * Get single log by ID
   */
  async getById (id: string): Promise<ILogger> {
    try {
      const record = await this.Model.findUnique({
        where: { id }
      })

      if (!record) {
        throwError(ERROR_CODE.NOT_FOUND, \`Log con ID \${id} no encontrado\`)
      }

      return this.parserFn(record!)
    } catch (error) {
      return processError(error, 'Log getById')
    }
  }

  /**
   * Create new log record
   */
  async create (data: Prisma.LogCreateInput): Promise<ILogger> {
    try {
      const record = await this.Model.create({ data })
      return this.parserFn(record)
    } catch (error) {
      return processError(error, 'Log create')
    }
  }

  /**
   * Update keep flag or other allowed fields
   */
  async update (id: string, data: LoggerUpdate): Promise<IActionResponse> {
    try {
      const record = await this.Model.findUnique({
        where: { id }
      })

      if (!record) {
        throwError(ERROR_CODE.NOT_FOUND, \`Log con ID \${id} no encontrado\`)
      }

      const updatedRecord = await this.Model.update({
        where: { id },
        data
      })

      return {
        message: 'Log actualizado correctamente',
        data: this.parserFn(updatedRecord)
      }
    } catch (error) {
      return processError(error, 'Log update')
    }
  }

  /**
   * Delete single log
   */
  async delete (id: string): Promise<string> {
    try {
      const record = await this.Model.findUnique({
        where: { id }
      })

      if (!record) {
        throwError(ERROR_CODE.NOT_FOUND, \`Log con ID \${id} no encontrado\`)
      }

      await this.Model.delete({
        where: { id }
      })

      return 'Log eliminado correctamente'
    } catch (error) {
      return processError(error, 'Log delete')
    }
  }

  /**
   * Delete all logs except those marked as keep = true
   */
  async deleteAll (): Promise<string> {
    try {
      await this.Model.deleteMany({
        where: {
          keep: false
        }
      })

      return 'Logs eliminados correctamente'
    } catch (error) {
      return processError(error, 'Log deleteAll')
    }
  }
}

export const loggerServiceDb = new LoggerServiceDb()`
}