import type { FilePattern } from '../../types.js'
import { baseReadme } from './templates/base.md.js'

export function readmeGenerator(options: FilePattern){
 const nameServer = capitalizeFirstLetter(options.selectedServer)
 const nameOrm = capitalizeFirstLetter(options.selectedOrm)

    return [
        {
        path:`/README.md`,
        file: baseReadme(options)
        }]
}
export function capitalizeFirstLetter(str:string):string{
  return str.charAt(0).toUpperCase() + str.slice(1)
}