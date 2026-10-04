import type {Orm} from './main-orm.js'


export const sequelize:Orm = {
        part1:`+ Sequelize`,
        part2:`**Sequelize v7 (PostgreSQL)**`,
        part3: `Database Models (src/models/):

Explicit Sequelize v7 models (user.model.ts, log.model.ts) mapped cleanly to PostgreSQL tables.`,
        part4: `
        
#### Database Connection (database.ts)

Manages Sequelize initialization, ORM models, and startup synchronization.`,
        part5: `
│   ├── models/                 # Sequelize database models
│   └── shared/                 # Shared functions, repositories, utilities & dependencies`,
        part6:`
### Initialize database with Sequelize

The models come pre-configured, though you can modify or add tables, columns, and rows.
Table declarations do not use decorators; instead, for the sake of compatibility, they use the old standard API (\`InferAttributes\`, \`InferCreationAttributes\`).


You can initialize the database by passing \`true\` as a parameter to \`startUp\`, which enables the \`sync\` method with \`force: false\`; passing a second \`true\` enables \`force: true\`. Keep in mind that this method overwrites all tables, resulting in data loss. 

Alternatively, you can initialize the database by installing \`sequelize-cli\` and creating or running a migration.


Examples 

\`\`\`javascript
//src/index.ts
import app from './app.js'
import { startUp } from './configs/database.js'
import envConfig from './configs/envConfig.js'

async function serverBootstrap(){
    try{
      await startUp(true, true) //(force:true)
        app.listen(envConfig.Port,() => {
        console.log(message)
            })
    }catch(error){
        console.error('Error initializing server: ',error)
        process.exit(1)
    }
}
serverBootstrap()
\`\`\`
`,

    }
