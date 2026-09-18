import type { FilePattern } from "../../types.js"
import {seqSessionAuthSnippetExpress} from '../seqFns/snippets/seqSessionAuthSnippets.js'
import { prisSessionAuthSnippetExpress } from "../prismaFns/snippets/prisSessionAuthSnippets.js"

export const sessionDbSnippets = (options: FilePattern) => {
    if(options.selectedOrm === 'sequelize')return seqSessionAuthSnippetExpress
    if(options.selectedOrm === 'prisma')return prisSessionAuthSnippetExpress
    return seqSessionAuthSnippetExpress
}