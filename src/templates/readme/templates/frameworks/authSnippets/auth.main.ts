import type { ProjectConfig } from '../../../../../types.js'
import type { Auth } from '../main.session.js'
import { authExpress } from './auth.express.js'
import { authFastify } from './auth.fastify.js'

export const authFunction = (options: ProjectConfig): Auth => {
    switch(options.selectedServer){
        case 'express':
            return authExpress
        case 'fastify' :
            return authFastify
        default:
            throw new Error(`Orm ${options.selectedOrm} not implemented yet`)
    }
}