 import { ProjectConfig } from "../../../../types.js"
 
export const userSchema = {
        subPath:`user.schema.ts`,
        file: `import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'


export const enumRole = pgEnum('role', ['OWNER', 'ADMIN', 'USER'])


export const user = pgTable('user',{
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 80 }).notNull().unique(),
  password: varchar('password', { length: 120 }).notNull(),
  nickname:varchar('nickname',{ length:80 }),
  name: varchar('name', { length:120 }),
  picture: varchar('picture', { length: 120 }),
  role: enumRole('role').notNull().default('USER'),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
})
`
    }
export const logSchema = {
        subPath:`log.schema.ts`,
        file: `import { pgTable, uuid, varchar, timestamp, boolean, bigint, text } from 'drizzle-orm/pg-core'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export const log = pgTable('log', {
  id: uuid('id').primaryKey(),
  levelName: varchar('level_name', { length: 120 }),
  levelCode: bigint('level_code', { mode: 'number' }),
  message: text('message'),
  type: varchar('type', { length: 80 }),
  status: bigint('status', { mode: 'number' }),
  stack: text('stack'),
  context: text('context').array(),
  pid: bigint('pid', { mode: 'number' }),
  time: bigint('time', { mode: 'number' }),
  hostname: varchar('hostname', { length: 120 }),
  keep: boolean('keep').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
})`
    }
 //* Optional Schema:
export const sessionSchema = {
      subPath: `session.schema.ts`,
      file:`import { pgTable, index, varchar, timestamp, text } from 'drizzle-orm/pg-core'

export const session = pgTable('session', {
    sid: varchar('sid', { length: 80 }).primaryKey(),
    expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
    data: text('data').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
}, (table)=>{
    return {
       expiresIdx: index('expires_idx').on(table.expires)
    }
}
)
`}
