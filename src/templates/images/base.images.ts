import type { FilePattern } from "../../types.js"

export const baseImages = (options:FilePattern)=>{
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