import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'


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
