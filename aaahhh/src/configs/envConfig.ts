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
  if (!key) { throw new Error(`La variable de entorno ${value} es requerida`) }
  const parsedEnv = Number(key)
  if (isNaN(parsedEnv)) { throw new Error(`La variable de entorno ${value} debe ser un numero entero`) }
  return parsedEnv
}

const getStringEnv = (value:string):string => {
  const key = process.env[value]
  if (!key) { throw new Error(`La variable de entorno ${value} es requerida`) }
  return key
}
const envConfig = {
  Port: getNumberEnv('PORT'),
  Status: NODE_ENV,
  UserImg: getStringEnv('USER_IMG'),
  
}
export default envConfig
  