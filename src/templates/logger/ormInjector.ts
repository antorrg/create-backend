import { loggerServiceDbPrisma } from '../persistence/prisma/snippets/logger.prismaSnippet.js'
import { loggerServiceDbSequelize } from '../persistence/seqFns/snippets/seqLoggerSnippet.js'
import type { ProjectConfig } from "../../types.js"


export const ormInjectorLog = (options: ProjectConfig) => {
  switch(options.selectedOrm){
    case 'sequelize': 
     return loggerServiceDbSequelize
    case 'prisma':
      return loggerServiceDbPrisma
    default:
          throw new Error(`Orm "${options.selectedOrm}" not implemented yet`)
}
}
