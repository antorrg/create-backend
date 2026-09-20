import type { ProjectConfig } from "../../types.js"

export const baseImages = (options:ProjectConfig)=>{
    return [
        {
            path:`serverAssets/fixtures/.gitkeep`,
            file: ''
        },
        {
            path:`serverAssets/uploads/.gitkeep`,
            file: '',
        }

    ]
}
/*          `${options.sourceFolderName}/shared/interfaces`,
  `serverAssets/fixtures`,
  'serverAssets/uploads',*/