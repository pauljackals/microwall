const app = require("./express")
const isDevelopment = require("./isDevelopment")

const createServer = () => {
    if(isDevelopment) {
        const http = require("http")

        return http.createServer(app)
    
    } else {
        const https = require("https")
        const fs = require("fs")

        return https.createServer({
            key: fs.readFileSync("./ssl/server.key"),
            cert: fs.readFileSync("./ssl/server.crt")
        }, app)
        
        
    }
}

module.exports = createServer()
