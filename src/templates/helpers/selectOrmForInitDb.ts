import type  { ProjectConfig } from '../../types.js'

export const selectOrmForInitDb = (options:ProjectConfig)=>{
    if(options.selectedOrm === 'sequelize')return 'await db.startUp(true, true)'
    if (options.selectedOrm === 'prisma')return 'await db.startUp(true)'
    return 'await db.startUp(true)'
}

export const testOrms = (options:ProjectConfig)=>{ 
 const testCode = {   
  pris:`describe('Database existence', () => {
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
  seq: `describe('Database existence', () => {
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
    `}
      if(options.selectedOrm === 'sequelize')return testCode.seq
    if (options.selectedOrm === 'prisma')return testCode.pris
    return testCode.seq
}