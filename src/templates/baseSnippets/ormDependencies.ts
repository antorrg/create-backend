import { FilePattern } from "../../types.js"
import { pkgJsonSnippet } from "../prismaFns/snippets/prisDepsSnippet.js"
import { seqDepSnippet } from '../seqFns/snippets/seqDepsSnippet.js'
import * as init from '../helpers/selectOrmForInitDb.js'


export function ormDependencies(options: FilePattern){
  switch(options.selectedOrm){
    case 'prisma':
      return {
        deps: pkgJsonSnippet,
        databases: postgresLines,
        initDb: init.selectOrmForInitDb(options),
        tests: init.testOrms(options)
      }
    case 'sequelize': {
      return {
        deps: seqDepSnippet,
        databases: postgresLines,
        initDb: init.selectOrmForInitDb(options),
        tests: init.testOrms(options)
      }
    }
    default:
      throw new Error(`This orm ${options.selectedOrm} is not implemented yet`)
  }
}

const postgresLines = {
environmentLine: 'DATABASE_URL=postgres://userName:password@localhost:5432/dbName',
envConfigLine: `,
   DatabaseUrl: getStringEnv('DATABASE_URL')`,
}
const singleLines = {
environmentLine: '',
envConfigLine: ``,
}