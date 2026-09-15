import { loggerServiceDbPrisma } from '../prismaFns/snippets/logger.prismaSnippet.js'
import { loggerServiceDbSequelize } from '../seqFns/snippets/seqLoggerSnippet.js'


export function ormInjectorLog(selectedOrm: string) {
  if (selectedOrm === 'prisma') return loggerServiceDbPrisma
  if(selectedOrm === 'sequelize') return loggerServiceDbSequelize
  // futuro: next, electron
  return loggerServiceDbPrisma
}