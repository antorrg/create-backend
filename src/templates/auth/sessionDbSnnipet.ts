import type { FilePattern } from "../../types.js"
import {seqSessionAuthSnippetExpress} from '../seqFns/snippets/seqSessionAuthSnippets.js'
import { prisSessionAuthSnippetExpress } from "../prismaFns/snippets/prisSessionAuthSnippets.js"

export const sessionDbSnippets = (options: FilePattern) => {
    if(options.selectedServer.endsWith('-seq'))return seqSessionAuthSnippetExpress
    if(options.selectedServer.endsWith('-pris'))return prisSessionAuthSnippetExpress
    return seqSessionAuthSnippetExpress
}