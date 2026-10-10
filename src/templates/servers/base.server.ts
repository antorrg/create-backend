import type { ProjectConfig } from "../../types.js"
import { generalBaseAuth } from "../auth/general-base.auth.js"
import { ormDependencies } from "../baseApp/baseSnippets/ormDependencies.js"
import { getFramDependencies } from "../baseApp/baseSnippets/getFrameworkDependencies.js"
import { frameworkInjector } from "./frameworkInjector.js"
import { authEnvironment } from "./express/files/index.js"
import * as dep from './baseServerFiles/index.js'



export const baseServer = (options:ProjectConfig)=>{
  const {importTest, deps, databases, initDb, tests } = ormDependencies(options)
  const {commonDep, auth} = getFramDependencies(options)
  const server = frameworkInjector(options)
    const serverFiles = [

        {
//package.json
path: `/package.json`,
file: `{
  "name": "${options.jsonProjectName}",
  "version": "1.0.0",
  "main": "dist/index.js",
  "type": "module",
  "directories": {
    "test": "test"
  },
  "scripts": {
  "dev": "cross-env NODE_ENV=development tsx watch ${options.sourceFolderName}/index.ts",
  "build": "tsc",
  "start": "cross-env NODE_ENV=production node dist/index.js",
  "lint": "eslint .",
  "test": "cross-env NODE_ENV=test vitest --run"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    ${deps.deps}
    "bcrypt": "^6.0.0",
    "cross-env": "^10.1.0",
    "dotenv": "^17.4.2",
    ${commonDep.dep}
    "pino": "^10.3.1",
    "pino-pretty": "^13.1.3",
    "uuid": "^14.0.2"${auth.dep}
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/bcrypt": "^6.0.0",${commonDep.devDep}
    "@types/node": "^22.20.5",
    "@types/supertest": "^7.2.1",
    "eslint": "^10.9.1",
    "globals": "^17.11.0",
    ${deps.devDeps} 
    "tsx": "^4.23.12",
    "supertest": "^7.2.2",
    "typescript": "^6.0.3",
    "typescript-eslint": "^8.68.0",
     "vitest": "^5.0.3"${auth.devDep}
  }
}`
        },
{
  //tsconfig.json
    path:`/tsconfig.json`,
    file:`{
"compilerOptions": {
"incremental": true,
"target": "ESNext",
"module": "NodeNext",
"removeComments": true,
"moduleResolution": "NodeNext",
"types": ["node"],
"resolveJsonModule": true,
"noEmit": false,
"outDir": "dist",
"rootDir": "${options.sourceFolderName}",
"isolatedModules": true,
"experimentalDecorators": true,         // NECESARIO para TypeORM y validadores
"allowSyntheticDefaultImports": true,
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true,
"strict": true,
"strictPropertyInitialization": true
  },
  "include": [
    "${options.sourceFolderName}/**/*.ts",
    "${options.sourceFolderName}/@types/**/*.d.ts", "${options.sourceFolderName}/Shared/Swagger/schemas/tools/generateSchema.ts",
      
  ],
  "exclude": [
    "node_modules",
    "dist",
    "data", 
    "tests",
    "**/*.test.ts",
    "**/*.help.ts"
  ]
}`},
{
    path:`/tsconfig.test.json`,
    file: `{
  "extends": "./tsconfig.json",
  "include": [
    "index.ts",
    "${options.sourceFolderName}/**/*.ts",
    "tests/**/*.ts",
  ],
  "exclude": [
    "node_modules",
    "dist",
    "data"
  ]
}`
},
{
    path:`/tsconfig.eslint.json`,
    file:`{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "${options.sourceFolderName}/**/*",
    "tests/**/*",
    "vitest.config.ts",
    "index.ts",
    "**/*.test.ts",
    "**/*.help.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}`
},
{
  //eslint
path: `/eslint.config.js`,
file: dep.eslint},
{
    path:`/.gitignore`,
    file:dep.gitignore
},
{
    path:`/.env.example`,
    file:`PORT=
USER_IMG=image.png
${databases.environmentLine}
${(options.selectedAuth !== 'auth-null')?authEnvironment.envLine: ''}
`,
},
{
    path:`/.env.development`,
    file:`PORT=4000
USER_IMG=image.png
${databases.environmentLine}
${(options.selectedAuth !== 'auth-null')?authEnvironment.envLine: ''}
`,
},
{
    path:`/.env.production`,
    file:`PORT=3000
USER_IMG=image.png
${databases.environmentLine}
${(options.selectedAuth !== 'auth-null')?authEnvironment.envLine: ''}
`,
},
{
    path:`/.env.test`,
    file:`PORT=8080
USER_IMG=image.png
${databases.environmentLine}
${(options.selectedAuth !== 'auth-null')?authEnvironment.envLine: ''}
`,
},
{
  path: `/vitest.config.ts`,
  file: `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true
  }
})`
},
{
  path: `/${options.sourceFolderName}/configs/envConfig.ts`,
  file: `import dotenv from 'dotenv'

const ENV_FILE = {
  production: '.env.production',
  development: '.env.development',
  test: '.env.test'
} as const
type Environment = keyof typeof ENV_FILE
const NODE_ENV = (process.env.NODE_ENV as Environment) ?? 'production'

dotenv.config({ path: ENV_FILE[NODE_ENV] })

const getNumberEnv = (value:string):number => {
  const key = process.env[value]
  if (!key) { throw new Error(\`La variable de entorno \${value} es requerida\`) }
  const parsedEnv = Number(key)
  if (isNaN(parsedEnv)) { throw new Error(\`La variable de entorno \${value} debe ser un numero entero\`) }
  return parsedEnv
}

const getStringEnv = (value:string):string => {
  const key = process.env[value]
  if (!key) { throw new Error(\`La variable de entorno \${value} es requerida\`) }
  return key
}
const envConfig = {
  Port: getNumberEnv('PORT'),
  Status: NODE_ENV${databases.envConfigLine},
  UserImg: getStringEnv('USER_IMG'),
  ${(options.selectedAuth !== 'auth-null')?authEnvironment.envConfigLine: ''}
}
export default envConfig
  `
},
//...server
    ]
    server.map( s => serverFiles.push(s))
const EnvDbTest = {
   path: `/${options.sourceFolderName}/configs/EnvDb.test.ts`,
 file: `
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.js'
import * as db from './database.js'
${importTest}


describe('EnvDb test', () => { 
  beforeAll(async() => {
    ${initDb}
  })
  afterAll(async() => {
    await db.closeDatabase()
  })
  describe('Environment variables', () => {
    it('should return the correct environment status and database variable', () => { 
      const formatEnvInfo = \`App running in: \${envConfig.Status}\`+
      \`Testing database: \${nameOfDb(envConfig.DatabaseUrl)}\`
      expect(formatEnvInfo).toBe(
        'App running in: test'+
        'Testing database: vgametest'
      )
    })
  })
${tests}
})

function nameOfDb(url:string): string {
  if (!url) return 'unknown'
  const parts = url.split('/')
  return parts[parts.length - 1] || 'unknown'
}
 `
}
const envTest = {
  path: `/${options.sourceFolderName}/configs/Env.test.ts`,
  file:`import { describe, it, expect } from 'vitest'
import envConfig from './envConfig.js'


describe('EnvDb test', () => { 

  describe('Environment variables', () => {
    it('should return the correct environment status and database variable', () => { 
      const formatEnvInfo = \`App running in: \${envConfig.Status}\`+
      \`User url image: \${envConfig.UserImg}\`
      expect(formatEnvInfo).toBe(
        'App running in: test'+
        'User url image: image.png'
      )
    })
  })
})`}
options.selectedOrm ==='none'
  ? serverFiles.push(envTest)
  : serverFiles.push(EnvDbTest)
if(options.selectedAuth.endsWith('-session')){
      const serverAuth = generalBaseAuth(options)
      serverFiles.push(...serverAuth)}
    
    return serverFiles
}

