import { ProjectConfig } from "../../../types.js"
import { pkgJsonSnippet } from "../../persistence/prisma/snippets/prisDepsSnippet.js"
import { seqDepSnippet } from '../../persistence/sequelize/snippets/seqDepsSnippet.js'
import { drizzleDepSnippet } from "../../persistence/drizzle/snippets/drizzleDepsSnippet.js"
import { testOrms } from './selectOrmForInitDb.js'


export function ormDependencies(options: ProjectConfig){
  const {importTest, startUp, testCode } = testOrms(options)
  switch(options.selectedOrm){
    case 'prisma':
      return {
        deps: pkgJsonSnippet,
        databases: postgresLines,
        importTest,
        initDb:startUp,
        tests: testCode
      }
    case 'sequelize': {
      return {
        deps: seqDepSnippet,
        databases: postgresLines,
        importTest,
        initDb:startUp,
        tests: testCode
      }
    }
    case 'drizzle': {
            return {
        deps: drizzleDepSnippet,
        databases: postgresLines,
        importTest,
        initDb:startUp,
        tests: testCode
      }
    }
    case 'none':{
            return {
        deps: singleDepSnippet,
        databases:singleLines,
        importTest: '',
        initDb: '',
        tests: ''
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
export const singleDepSnippet = {
  deps: ``,
  devDeps: ``
}