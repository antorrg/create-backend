import { pgTable, uuid, varchar, timestamp, boolean, bigint, text } from 'drizzle-orm/pg-core'

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
})