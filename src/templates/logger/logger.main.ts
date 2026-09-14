import type { FilePattern } from "../../types.js"
import { ormInjectorLog } from "./ormInjector.js"
import { controllerInjectorSnippets } from "./controllerInjectorSnippets.js"

export const loggerTs = (options:FilePattern)=>{
  const serviceDb = ormInjectorLog(options.selectedServer)
  const controllerLog = controllerInjectorSnippets(options.selectedServer)

    return[

{
//# Crear archivo de manejo de errores de Express
path: `/${options.sourceFolderName}/configs/logger.ts`,
file: `
import pino, { type Logger as PinoLogger } from 'pino'
import envConfig from './envConfig.js'
import { fileTransport } from './logger/transports/fileTransport.js'
import { dbWritableStream } from './logger/transports/dbTransport.js'

let logger: PinoLogger

switch (envConfig.Status) {
  case 'test':
    // Pretty print en consola, simple
    logger = pino({
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    })
    break

  case 'development': // dev
    // Guardar logs en archivo
    logger = pino({
      level: 'info',
      transport: fileTransport()
    })
    break

  case 'production':
    // Guardar logs en la base de datos usando Sequelize
    logger = pino(
      {
        level: 'info'
      },
      dbWritableStream() // stream personalizado
    )
    break

  default:
    logger = pino()
}

export default logger
`},
{

path: `/${options.sourceFolderName}/configs/logger/transports/fileTransport.ts`,
file: `
export function fileTransport () {
  return {
    target: 'pino-pretty',
    options: {
      colorize: false,
      destination: './logs/app.log',
      mkdir: true
    }
  }
}
`
},
{


path: `/${options.sourceFolderName}/configs/logger/transports/dbTransport.ts`,
file:
`import { Writable } from 'node:stream'
import { LoggerServiceDb, loggerServiceDb, LogLevel } from '../LoggerServiceDb.js'
import { UuidHandler } from '../../../shared/utils/UuidHandler.js'

export { LoggerServiceDb, loggerServiceDb }


export function levelToText(level: number): LogLevel {
  if (level >= 60) return LogLevel.FATAL
  if (level >= 50) return LogLevel.ERROR
  if (level >= 40) return LogLevel.WARN
  if (level >= 30) return LogLevel.INFO
  return LogLevel.DEBUG
}

export function dbWritableStream(): Writable {
  return new Writable({
    objectMode: true,
    write(chunk, _encoding, callback) {
      try {
        const log = typeof chunk === 'string' ? JSON.parse(chunk) : chunk
        const levelName = levelToText(log.level ?? 30)

        loggerServiceDb.create({
          id: log.id ?? UuidHandler.createUuid(),
          levelName,
          levelCode: log.level ?? 30,
          message: log.msg ?? log.message ?? '',
          type: log.err?.type ?? log.type ?? 'INFO',
          stack: log.err?.stack ?? log.stack ?? null,
          context: log.err?.contexts ?? log.contexts ?? [],
          pid: log.pid ?? process.pid,
          time: log.time ?? Date.now(),
          hostname: log.hostname ?? 'localhost',
          keep: Boolean(log.keep)
        })
          .then(() => callback())
          .catch((err: unknown) => callback(err as Error))
      } catch (err) {
        callback(err as Error)
      }
    }
  })
}
`
},
{

path: `/${options.sourceFolderName}/configs/logger/Logger.interfaces.ts`,
file: `
import type { LogLevel } from ${serviceDb.importType}
export interface ILogger {
  id: string
  levelName: LogLevel | string
  levelCode: number
  message: string
  type?: string | null
  status?: number | null
  stack?: string | null
  contexts?: string[]
  pid: number
  time: number
  hostname: string
  keep: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoggerCreate {
  levelName: LogLevel
  levelCode: number
  message: string
  type?: string
  stack?: string
  contexts?: string[]
  pid?: number
  time?: number
  hostname?: string
  keep?: boolean
}

export type LoggerUpdate = Partial<Pick<ILogger, 'keep'>>

interface IPagesInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IPaginatedResponse {
  info: IPagesInfo
  data: ILogger[]
}

export type OrderDirection = 'ASC' | 'DESC' | 'asc' | 'desc'

export interface Order<T> {
  field: keyof T
  direction: OrderDirection
}

export interface IPagesOptions<T> {
  searchField?: keyof T | string
  search?: string | null
  page?: number
  limit?: number
  sortBy?: keyof T | string
  order?: OrderDirection
}

export interface IActionResponse {
  message: string
  data: ILogger
}

export interface ILoggerService<TLog, TLogUpdate> {
  getAll: (options?: IPagesOptions<TLog>) => Promise<IPaginatedResponse>
  getById: (id: string) => Promise<TLog>
  update: (id: string, data: TLogUpdate) => Promise<IActionResponse>
  delete: (id: string) => Promise<string>
  deleteAll: () => Promise<string>
}
`
},
{
   path:`/${options.sourceFolderName}/configs/logger/LoggerServiceDb.ts`,
   file:`${serviceDb.file}`
},
        {
path:`/${options.sourceFolderName}/configs/logger/${controllerLog.subPath}`,
file: `${controllerLog.file}`
        }
]
}

