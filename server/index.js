const isDevelopment = require("./config/isDevelopment")
if(isDevelopment) {
    require("dotenv").config({path: "../.env"})
}

const express = require("express")
const http = require("http")
const expressSession = require("express-session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const passport = require("passport")
const passportLocal = require("passport-local")

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
if(isDevelopment) {
    app.use(cors({
        credentials: true,
        origin: "http://localhost:8080"
    }))
}

const port = process.env.SERVER_PORT || 5000
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
