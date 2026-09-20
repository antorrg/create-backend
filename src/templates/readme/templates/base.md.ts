import type { ProjectConfig } from '../../../types.js'
import {expressMd} from './frameworks/express.md.js'
import {fastifyMd} from './frameworks/fastify.md.js'
import { electronMd } from './frameworks/electron.md.js'
import { nextMd } from './frameworks/next.md.js'

export const baseReadme = (options: ProjectConfig) => {
    switch(options.projectType){
        case 'nextServer':
            return nextMd(options)
        case 'electronNode':
            return electronMd(options)
        case 'webServer':
            return serverReadme(options)
        default : 
         throw new Error(`Project ${options.projectType} not implemented yet`)
    }
}

const serverReadme = (options: ProjectConfig) => {
    switch(options.selectedServer){
        case 'express':
            return expressMd(options)
        case 'fastify':
            return fastifyMd(options)
        default:
            throw new Error(`Framework ${options.selectedServer} not implemented yet`)
    }
}