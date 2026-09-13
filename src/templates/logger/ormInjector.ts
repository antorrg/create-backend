import { loggerServiceDbPrisma } from '../prismaFns/snippets/logger.prismaSnippet.js'
import { loggerServiceDbSequelize } from '../seqFns/snippets/seqLoggerSnippet.js'


export function ormInjectorLog(selectedServer: string) {
  if (selectedServer.endsWith('-pris')) return loggerServiceDbPrisma
  if(selectedServer.endsWith('-seq'))  return loggerServiceDbSequelize
  // futuro: next, electron
  return loggerServiceDbPrisma
}