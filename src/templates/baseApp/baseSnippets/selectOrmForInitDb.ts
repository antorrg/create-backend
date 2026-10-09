import type  { ProjectConfig } from '../../../types.js'


export const testOrms = (options:ProjectConfig)=>{ 

 const objectTest = {   
  prisma:`describe('Database existence', () => {
    it('should query tables and return an empty array', async () => {
        const results = await Promise.all([
        db.prisma.user.findMany(),
        db.prisma.log.findMany(),
         ${options.selectedAuth.endsWith('session')?'db.prisma.session.findMany(),': ''}
        ])
        results.forEach((result) => {
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
        })
    })
  })`,
  sequelize: `describe('Database existence', () => {
    it('should query tables and return an empty array', async() => { 
      const models = [ 
        db.Log,
        db.User,
        ${options.selectedAuth.endsWith('session')?'db.Session,': ''}
        ]
      for (const model of models) {
        const records = await model.findAll()
        expect(Array.isArray(records)).toBe(true)
        expect(records.length).toBe(0)
      }
    })
  })
    `,
  drizzle: `  describe('Database existence', () => {
    it('should query tables and return an empty array', async () => {
      const results = await Promise.all([
        db.db.select().from(user),
        db.db.select().from(log),
        ${options.selectedAuth.endsWith('session')?'db.db.select().from(session),': ''}
      ])
      results.forEach((result) => {
        expect(Array.isArray(result)).toBe(true)
      })
    })
  })
})
    `}
      switch(options.selectedOrm){
    case 'sequelize':
     return {startUp: 'await db.startUp(true, true)',
             testCode: objectTest.sequelize
     }
    case 'prisma':
      return {startUp: 'await db.startUp(true)',
             testCode: objectTest.prisma
     }
    case 'drizzle': 
      return {startUp: 'await db.startUp()',
             testCode: objectTest.drizzle
     }
    default: throw new Error(`[Orm-Section]: Orm ${options.selectedOrm} not implemented yet`)
  }
}