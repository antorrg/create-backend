import envConfig from './envConfig.js'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import logger from './logger.js'

const { Pool } = pg

const pool = new Pool({
  connectionString: envConfig.DatabaseUrl
})

const db = drizzle(pool)

// Inicio y validacion
function getNameDb(dbUri: string): string {
  return dbUri.split('/').slice(-1).join()
}

async function startUp() {
  const successMsg = `🟢 Database "${getNameDb(envConfig.DatabaseUrl)}" ready`
  const errorMsg = `❌ Database "${getNameDb(envConfig.DatabaseUrl)}" can't connect`
  try {
    await pool.query('SELECT 1')
    console.log(successMsg)
    logger.info(successMsg)
  } catch (error) {
    console.error(errorMsg)
    logger.error(error)
  }
}

async function closeDatabase() {
  try {
    await pool.end()
  } catch (error) {
    logger.error(error)
  }
}

export {
  pool,
  db,
  startUp,
  closeDatabase
}