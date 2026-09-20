import type { FilePattern } from '../../../types.js'
import {expressMd} from './frameworks/express.md.js'
import {fastifyMd} from './frameworks/fastify.md.js'

export const baseReadme = (options: FilePattern) => {
    switch(options.selectedServer){
        case 'express':
            return expressMd(options)
        case 'fastify':
            return fastifyMd(options)
        default:
            throw new Error(`Framework ${options.selectedServer} not implemented yet`)
    }
}