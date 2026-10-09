import { loggerServiceDbPrisma } from '../../persistence/prisma/snippets/logger.prismaSnippet.js'
import { loggerServiceDbSequelize } from '../../persistence/sequelize/snippets/seqLoggerSnippet.js'
import { loggerServiceDbDrizzle } from '../../persistence/drizzle/snippets/drizzleLoggerSnippet.js'
import type { ProjectConfig } from "../../../types.js"


export const ormInjectorLog = (options: ProjectConfig) => {
  switch(options.selectedOrm){
    case 'none':
      return loggerStandAlone
    case 'sequelize': 
     return loggerServiceDbSequelize
    case 'prisma':
      return loggerServiceDbPrisma
    case 'drizzle':
      return loggerServiceDbDrizzle
    default:
          throw new Error(`Orm "${options.selectedOrm}" not implemented yet`)
}
}
const loggerStandAlone = {
  importType:'',
  file:'export {}'}