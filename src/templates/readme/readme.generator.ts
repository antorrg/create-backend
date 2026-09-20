import type { ProjectConfig } from '../../types.js'
import { baseReadme } from './templates/base.md.js'

export function readmeGenerator(options: ProjectConfig){

    return [
        {
        path:`/README.md`,
        file: baseReadme(options)
        }]
}
export function capitalizeFirstLetter(str:string):string{
  return str.charAt(0).toUpperCase() + str.slice(1)
}