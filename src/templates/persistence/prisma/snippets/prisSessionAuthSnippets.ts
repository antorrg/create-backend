

export const prisSessionAuthSnippetExpress = {
    file: `import { prisma } from '../../../configs/database.js'
import type { ISessionAdapter, DefaultFields } from './types.js'

class ConnectDb implements ISessionAdapter {
  async get(sid: string) {
    const record = await prisma.session.findFirst({
      where: {
        sid,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!record) return null
    return record
  }

  async set(sid: string, defaults: DefaultFields) {
    await prisma.session.upsert({
      where: { sid },
      update: {
        data: defaults.data,
        expires: defaults.expires
      },
      create: {
        sid,
        data: defaults.data,
        expires: defaults.expires
      }
    })
  }

  async touch(sid: string, expires: Date) {
    await prisma.session.updateMany({
      where: { sid },
      data: { expires }
    })
  }

  async destroy(sid: string) {
    await prisma.session.deleteMany({
      where: { sid }
    })
  }

  async length(): Promise<number> {
    return prisma.session.count({
      where: {
        expires: {
          gt: new Date()
        }
      }
    })
  }

  async clearExpiredSessions(now: Date = new Date()) {
    await prisma.session.deleteMany({
      where: {
        expires: {
          lt: now
        }
      }
    })
  }
}

const sessionAdapter = new ConnectDb()
export default sessionAdapter
`,
}
