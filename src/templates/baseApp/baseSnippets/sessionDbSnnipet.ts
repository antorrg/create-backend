import type { ProjectConfig } from "../../../types.js"
import {seqSessionAuthSnippetExpress} from '../../persistence/sequelize/snippets/seqSessionAuthSnippets.js'
import { prisSessionAuthSnippetExpress } from "../../persistence/prisma/snippets/prisSessionAuthSnippets.js"
import { drizzleessionAuthSnippetExpress } from "../../persistence/drizzle/snippets/drizzleSessionAuthSnippets.js"

export const sessionDbSnippets = (options: ProjectConfig) => {
    switch(options.selectedOrm){
        case 'sequelize':
            return seqSessionAuthSnippetExpress
        case 'prisma': 
            return prisSessionAuthSnippetExpress
        case 'drizzle':
            return drizzleessionAuthSnippetExpress
        default:
            throw new Error(`Orm option ${options.selectedOrm} not implemented yet`)
    }
}