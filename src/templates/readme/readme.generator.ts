import type { ProjectConfig } from '../../types.js'
import { baseReadme } from './templates/base.md.js'

export function readmeGenerator(options: ProjectConfig){

    return [
        {
        path:`/README.md`,
        file: baseReadme(options)
        },
        {
         path:`/tests/unit/README.md`,
        file: `# Unit tests

Place unit tests here.`
        },
        {
         path:`/tests/integration/README.md`,
        file: `# Integration tests

Place integration tests here.`
        }
      ]
}
export function capitalizeFirstLetter(str:string):string{
  return str.charAt(0).toUpperCase() + str.slice(1)
}