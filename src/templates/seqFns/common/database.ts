/**
 * database1 
 * database2
 */
export const database1 = `import envConfig from './envConfig.js'
import logger from './logger.js'
import { Sequelize } from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres';
import modelsDefinition from '../models/index.model.js'

const uri = splitName(envConfig.DatabaseUrl)
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: uri.database,
  user: uri.username,
  password: uri.password,
  host: uri.host,
  port: Number(uri.port),
  ssl: false,
  clientMinMessages: 'notice',
})


const [
  User,`
export const database2 =`] = Object.values(modelsDefinition).map(model => model(sequelize))

function getNameDb(dbUri:string):string {
 return dbUri.split('/').slice(-1).join()
}

async function startUp (syncDb: boolean = false, rewrite: boolean = false) {
  try {
    await sequelize.authenticate()
    const successMessage =\`🟢​ Database postgreSQL "\${getNameDb(envConfig.DatabaseUrl)}" initialized successfully!!\`
    console.log(successMessage)
    if (envConfig.Status !== 'production' && syncDb) {
      try {
        await sequelize.sync({ force: rewrite })
        let message = \`🧪 Synced database \${getNameDb(envConfig.DatabaseUrl)}: "force \${rewrite}"\`
        logger.info(message)
      } catch (error) {
        logger.error(error)
        //console.error(\`❗Error syncing database \${getNameDb(envConfig.DatabaseUrl)}\`, error)
      }
    }
    logger.info(successMessage)
  } catch (error) {
    //console.error('❌ Error conecting database!', error)
    logger.error(error)
  }
}
const closeDatabase = async () => {
  await sequelize.close()
  logger.info('🛑 Database disconnect')
}
function splitName(value:string){
  const normalized = value.replace('postgres://', 'http://')
  const url = new URL(normalized)

  return {
    protocol: url.protocol.replace(':', ''),
    username: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port,
    database: url.pathname.replace('/', ''),
    logging:false
  }
}

export {
    User,`