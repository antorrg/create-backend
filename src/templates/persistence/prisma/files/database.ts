
export const database = `import envConfig from './envConfig.js'
import logger from './logger.js'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js"
import { execSync } from 'child_process'

const connectionString = \`\${envConfig.DatabaseUrl}\`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function getNameDb(dbUri:string):string {
 return dbUri.split('/').slice(-1).join()
}

const startUp = async (reset = false) => {
  try {
    await prisma.$connect()
    const succesmsg = \`🟢 Database \${getNameDb(envConfig.DatabaseUrl)} connected successfully\`

    if (reset === true) {
      // db push usa la URL definida en prisma.config.js (no en schema)
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' })
      logger.info(\`🧪 Database \${getNameDb(envConfig.DatabaseUrl)} cleaned and reset\`)
    }
    await prisma.$connect()
      logger.info(succesmsg)
      console.log(succesmsg)
  } catch (error) {
    logger.error('❌ Error connecting database:', error as any)
    throw error
  }
}

const closeDatabase = async () => {
  try {
// Delay to wait for pending operations (tests)
    await new Promise(res => setTimeout(res, 20))
    await prisma.$disconnect()
    logger.info('🛑 Closing conection database.')
  } catch (error) {
    logger.error('❌ Error closing conection database:', error as any)
    throw error
  }
}

export {
    prisma,
    startUp,
    closeDatabase
}`