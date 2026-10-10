import type { ProjectConfig } from "../../types.js"
import { sequelizeAuthTestSnippet } from "./sequelize/snippets/sequelizeAuthTestSnippets.js"
import { prismaAuthTestSnippet } from "./prisma/snippets/prismaAuthTestSnippets.js"
import { drizzleAuthTestSnippet } from "./drizzle/snippets/drizzleAuthTestSnippets.js"


export const sessionOrmSnippet = (options: ProjectConfig) => {
    switch(options.selectedOrm){
        case 'sequelize':
            return sequelizeAuthTestSnippet
        case 'prisma':
            return prismaAuthTestSnippet
        case 'drizzle': 
            return drizzleAuthTestSnippet
        default:
            throw new Error(`[Auth.sessionOrmSnippet]: ${options.selectedOrm} cause`)
    }
}