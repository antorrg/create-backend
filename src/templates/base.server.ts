import { getOrmDependencies } from "./helpers/getOrmsSnippets.js"
import { getFramDependencies } from "./helpers/getFrameworsSnippets.js"
import type { FilePattern } from "../types.js"
import { dbSnippet } from "./baseSnippets/dbSnippet.js"
import { authDependencies } from "./auth/auth.snippets.js"
import { selectOrmForInitDb, testOrms } from "./helpers/selectOrmForInitDb.js"



export const baseServer = (options:FilePattern)=>{
  const deps = getOrmDependencies(options.selectedServer)
  const framework = getFramDependencies(options.selectedServer)
  const databases = dbSnippet(options.selectedServer)
  const initDb = selectOrmForInitDb(options)
  const tests = testOrms(options)
    return[

        {
//package.json
path: `/package.json`,
file: `{
  "name": "${options.projectName}",
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
    "cors": "^2.8.6",
    "cross-env": "^10.1.0",
    "dotenv": "^17.4.2",
    ${framework.deps}
    "pino": "^10.3.1",
    "pino-pretty": "^13.1.3",
    "uuid": "^14.0.2"${(options.selectedAuth !== 'auth-null')?authDependencies.dep: ''}
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/bcrypt": "^6.0.0",
    "@types/cors": "^2.8.19",
    ${framework.devDeps}
    "@types/node": "^26.4.0",
    "@types/supertest": "^7.2.1",
    "eslint": "^10.9.1",
    "globals": "^17.11.0",
    ${deps.devDeps} 
    "tsx": "^4.23.12",
    "supertest": "^7.2.2",
    "typescript": "^7.0.2",
    "typescript-eslint": "^8.68.0",
    "vitest": "^4.1.11"${(options.selectedAuth !== 'auth-null')?authDependencies.devDep: ''}
  }
}`
        },
{
  //eslint
path: `/eslint.config.js`,
file: `import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {ignores: ['dist', 'build', 'coverage', 'node_modules', 'drizzle']},
  {
    name: 'app.src',
    files: ['src/**/*.ts', 'index.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    extends: [ 
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    rules:{
      semi:['error', 'never'],
      quotes: ['error', 'single', {avoidEscape: true}],
      'comma-dangle': ['error', 'never'],
      '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'indent': ['error', 2],
      'space-before-function-paren': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', {before: true, after: true}]
    }
  },
  {
    name: 'app:tests',
    files: ['test/**/*.ts', 'tests/**/*.ts', '**/*.{test,spec}.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    },
    extends: [ 
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    rules:{
      '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
)
`},
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
    path:`/.gitignore`,
    file:`# ---------------------------------------
# Logs
# ---------------------------------------
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# ---------------------------------------
# Runtime data
# ---------------------------------------
pids
*.pid
*.seed
*.pid.lock

# ---------------------------------------
# Coverage / testing
# ---------------------------------------
lib-cov
coverage
*.lcov
.nyc_output

# ---------------------------------------
# Dependency directories
# ---------------------------------------
node_modules/
dist/

# ---------------------------------------
# Assets (uploads temporales)
# ---------------------------------------
servarAssets/uploads/*
!servarAssets/uploads/.gitkeep
data/

# ---------------------------------------
# TypeScript cache
# ---------------------------------------
*.tsbuildinfo

# ---------------------------------------
# npm cache (opcional)
# ---------------------------------------
.npm

# ---------------------------------------
# Firebase (si lo usás)
# ---------------------------------------
firebase-admin-key.json

# ---------------------------------------
# ESLint y Stylelint cache
# ---------------------------------------
.eslintcache
.stylelintcache

# ---------------------------------------
# REPL history
# ---------------------------------------
.node_repl_history

# ---------------------------------------
# npm pack output
# ---------------------------------------
*.tgz

# ---------------------------------------
# dotenv environment variable files
# ---------------------------------------
.env
.env.*
!.env.example

# ---------------------------------------
# VSCode (opcional)
# ---------------------------------------
.vscode-test`
},
{
    path:`/.env.example`,
    file:`PORT=
${databases.environmentLine}
USER_IMG=
${(options.selectedAuth !== 'auth-null')?authDependencies.envLine: ''}
`,
},
{
    path:`/.env.development`,
    file:`PORT=4000
${databases.environmentLine}
USER_IMG=
${(options.selectedAuth !== 'auth-null')?authDependencies.envLine: ''}
`,
},
{
    path:`/.env.production`,
    file:`PORT=3000
${databases.environmentLine}
USER_IMG=
${(options.selectedAuth !== 'auth-null')?authDependencies.envLine: ''}
`,
},
{
    path:`/.env.test`,
    file:`PORT=8080
${databases.environmentLine}
USER_IMG=
${(options.selectedAuth !== 'auth-null')?authDependencies.envLine: ''}
`,
},
{
  path: `/vitest.config.ts`,
  file: `
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true
  }
})`
},
{
  path: `/${options.sourceFolderName}/configs/envConfig.ts`,
  file: `
import dotenv from 'dotenv'

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
  ${(options.selectedAuth !== 'auth-null')?authDependencies.envConfigLine: ''}
}
export default envConfig
  `
},
{
   path: `/${options.sourceFolderName}/configs/EnvDb.test.ts`,
 file: `
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.js'
import * as db from './database.js'


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
},

    ]
}