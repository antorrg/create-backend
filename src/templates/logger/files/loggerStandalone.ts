export const loggerStandAlone = `import pino, { type Logger as PinoLogger } from 'pino'
import envConfig from './envConfig.js'
import { fileTransport } from './logger/transports/fileTransport.js'

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
        level: 'info',
        transport: fileTransport()
      },
      
    )
    break

  default:
    logger = pino()
}

export default logger
`