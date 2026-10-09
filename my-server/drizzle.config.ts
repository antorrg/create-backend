import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'


export default {
  schema: './src/schemas/index.schemas.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
