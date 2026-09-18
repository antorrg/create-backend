import { loggerServiceDbPrisma } from '../prismaFns/snippets/logger.prismaSnippet.js'
import { loggerServiceDbSequelize } from '../seqFns/snippets/seqLoggerSnippet.js'
import type { FilePattern, AppOrm } from "../../types.js"

type DbInjector = {
  importType:string
  file: string
}

const ormInjectorHandlers: Partial<Record<AppOrm, DbInjector>> = {
  sequelize: loggerServiceDbSequelize,
  prisma: loggerServiceDbPrisma
}

export const ormInjectorLog = (options: FilePattern) => {
  const handler = ormInjectorHandlers[options.selectedOrm]

  if (!handler) {
    throw new Error(
      `Orm "${options.selectedOrm}" not implemented yet`
    )
  }
  return handler
}
