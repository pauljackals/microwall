const isDevelopment = require("./config/isDevelopment")
if(isDevelopment) {
    require("dotenv").config({path: "../.env"})
}

const express = require("express")
const app = require("./config/express")
const server = require("./config/server")
const expressSession = require("./config/session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const passport = require("passport")
const router = require("./routes/router")
const errorHandler = require("./utils/errorHandler")

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:8080"
}))

app.use(expressSession)

app.use(passport.initialize())
app.use(passport.session())

const User = require("./models/User")
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

require("./namespaces/namespaces")

app.use(router)
app.use(errorHandler)

const port = process.env.SERVER_PORT || 5000
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
