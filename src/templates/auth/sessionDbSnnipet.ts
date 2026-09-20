import type { ProjectConfig } from "../../types.js"
import {seqSessionAuthSnippetExpress} from '../persistence/seqFns/snippets/seqSessionAuthSnippets.js'
import { prisSessionAuthSnippetExpress } from "../persistence/prisma/snippets/prisSessionAuthSnippets.js"

export const sessionDbSnippets = (options: ProjectConfig) => {
    switch(options.selectedOrm){
        case 'sequelize':
            return seqSessionAuthSnippetExpress
        case 'prisma': 
            return prisSessionAuthSnippetExpress
        default:
            throw new Error(`Orm option ${options.selectedOrm} not implemented yet`)
    }
}