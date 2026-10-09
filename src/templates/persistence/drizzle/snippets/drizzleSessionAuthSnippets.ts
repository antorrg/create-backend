

export const drizzleessionAuthSnippetExpress = {
    file: `import { eq, and, gt, lt, count } from 'drizzle-orm'
import { db } from '../../../configs/database.js'
import { session } from '../../../schemas/index.schemas.js'
import type { ISessionAdapter, DefaultFields } from './types.js'

class ConnectDb implements ISessionAdapter {
  async get(sid: string) {
    const records = await db
      .select()
      .from(session)
      .where(and(eq(session.sid, sid), gt(session.expires, new Date())))
      .limit(1)

    const record = records[0]
    if (!record) return null
    return record
  }

  async set(sid: string, defaults: DefaultFields) {
    await db
      .insert(session)
      .values({
        sid,
        data: defaults.data,
        expires: defaults.expires,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: session.sid,
        set: {
          data: defaults.data,
          expires: defaults.expires,
          updatedAt: new Date()
        }
      })
  }

  async touch(sid: string, expires: Date) {
    await db
      .update(session)
      .set({
        expires,
        updatedAt: new Date()
      })
      .where(eq(session.sid, sid))
  }

  async destroy(sid: string) {
    await db
      .delete(session)
      .where(eq(session.sid, sid))
  }

  async length(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(session)
      .where(gt(session.expires, new Date()))

    return Number(result?.count ?? 0)
  }

  async clearExpiredSessions(now: Date = new Date()) {
    await db
      .delete(session)
      .where(lt(session.expires, now))
  }
}

const sessionAdapter = new ConnectDb()
export default sessionAdapter
`,
}
