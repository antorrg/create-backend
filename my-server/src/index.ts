import app from './app.js'
import { startUp } from './configs/database.js'
import envConfig from './configs/envConfig.js'

const message =`Server is listening on port ${envConfig.Port}\nServer in ${envConfig.Status}\n 🚀​ Everything is allright!!`
async function serverBootstrap(){
    try{
      await startUp()
        app.listen(envConfig.Port,() => {
        console.log(message)
            })
    }catch(error){
        console.error('Error initializing server: ',error)
        process.exit(1)
    }
}
serverBootstrap()