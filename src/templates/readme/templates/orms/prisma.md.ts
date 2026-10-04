
export const prisma =  {
        part1:`+ Prisma`,
        part2:`**Prisma v7 (PostgreSQL)**`,
        part3: `Database Models (./schema/schema.prisma):

Explicit Prisma v7 models mapped cleanly to PostgreSQL tables.`,
        part4: `
        
#### Database Connection (database.ts)

Manages Prisma initialization, and startup synchronization.`,

        part5: `
│   │
│   └── shared/                 # Shared functions, repositories, utilities & dependencies
├── prisma/                     # Prisma database models
├── prisma.config.ts            # Prisma setup
├── .env                        # Development environment for prisma database url`,
        part6:`
### Initialize Prisma

The models come pre-configured, though you can modify or add tables, columns, and rows.
You must initialize the database using the commands **\`prisma migrate dev\`** (migration name) and then **\`prisma generate\`**, as shown in the examples below. Pay special attention to ensure that the database being initialized is the one specified in the \`.env\` file.
When running migrations and generation, Prisma relies solely on the \`.env\` environment variable; other variables will be read from their respective files once the project is initialized. Therefore, upon starting, you must run a migration and a generation for each database by manually loading its URL into the \`.env\` file. This approach ensures that Prisma's default behavior remains unaltered.
Examples 

\`\`\`bash
- npx prisma migrate dev ...name

- npx prisma generate
\`\`\`
`,

    }
