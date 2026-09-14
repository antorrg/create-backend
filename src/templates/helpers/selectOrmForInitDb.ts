import type  {FilePattern } from '../../types.js'

export const selectOrmForInitDb = (options:FilePattern)=>{
    if(options.selectedServer.endsWith('-seq'))return 'await db.startUp(true, true)'
    if (options.selectedServer.endsWith('-pris'))return 'await db.startUp(true)'
    return 'await db.startUp(true)'
}

export const testOrms = (options:FilePattern)=>{ 
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
      if(options.selectedServer.endsWith('-seq'))return testCode.seq
    if (options.selectedServer.endsWith('-pris'))return testCode.pris
    return testCode.seq
}