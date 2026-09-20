import { FilePattern } from "../../types.js"
import { authDeps } from "../servers/express/snippets/auth.snippets.js"
import { expressJsonSnippet } from "../servers/express/snippets/expressDepsSnippet.js"
import { fastifyJsonSnippet,  fastifyAuthSnippet} from "../servers/fastify/snippets/fastifyJsonSnippet.js"


export function getFramDependencies(options: FilePattern) {
 switch(options.selectedServer){
  case 'express':
    return {
      commonDep: expressJsonSnippet,
      auth: (options.selectedAuth !== 'auth-null')? authDeps: authNull
    }
  case 'fastify': 
    return {
      commonDep: fastifyJsonSnippet,
       auth: (options.selectedAuth !== 'auth-null')? fastifyAuthSnippet : authNull
    }
  default:
    throw new Error(`Framework ${options.selectedServer} not implemented yet`)
 }
}

const authNull = {  
    dep:'',
  devDep: ''}