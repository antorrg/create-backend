
export const drizzle=  {
        part1:`+ Drizzle`,
        part2:`**Drizzle v0 (PostgreSQL)**`,
        part3: `Database Models (./schema/schema.prisma):

Explicit drizzle-orm V0.45.3 models mapped cleanly to PostgreSQL tables.`,
        part4: `
        
#### Database Connection (database.ts)

Manages Prisma initialization, and startup synchronization.`,

        part5: `
│   └── schemas/                # Schemas from drizzle
│   └── shared/                 # Shared functions, repositories, utilities & dependencies
├── drizzle.config.ts            # drizzle setup
├── .env                        # Development environment for drizzle database url`,
        part6:`
### Initialize drizzle

The models come pre-configured, though you can modify or add tables, columns, and rows.
You must initialize the database using the commands **\`prisma migrate dev\`** (migration name) and then **\`prisma generate\`**, as shown in the examples below. Pay special attention to ensure that the database being initialized is the one specified in the \`.env\` file.
When running migrations and generation, Prisma relies solely on the \`.env\` environment variable; other variables will be read from their respective files once the project is initialized. Therefore, upon starting, you must run a migration and a generation for each database by manually loading its URL into the \`.env\` file. This approach ensures that Prisma's default behavior remains unaltered.
Examples 

\`\`\`bash
- npx drizzle-kit generate

- npx drizzle-kit migrate
\`\`\`
`,

    }