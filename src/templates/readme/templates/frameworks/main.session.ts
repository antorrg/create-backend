import type { ProjectConfig } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";
import { authFunction } from './authSnippets/auth.main.js'

export const mainSession = (options: ProjectConfig): Auth => {
    switch(options.selectedAuth){
        case 'auth-null':
            return authNull
        case 'auth-session' :
            return authFunction(options)
        default:
            throw new Error(`Auth ${options.selectedAuth} not implemented yet`)
    }
}
export type Auth= {
    part1: string
    part2: string
    part3: string
    part4: string
} 
const authNull = {
    part1: ` `,
    part2: ' ',
    part3: '',
    part4: '\n',
}