const isDevelopment = require("./config/isDevelopment")
if(isDevelopment || process.env.PROD_LOCAL) {
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

if(!isDevelopment) {
    const history = require('connect-history-api-fallback')
    app.use(history())
    app.use(express.static("./dist"))
}
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: isDevelopment ? `http://localhost:${process.env.VUE_APP_CLIENT_PORT || 8080}` : undefined
}))

app.use(expressSession)

app.use(passport.initialize())
app.use(passport.session())

const User = require("./models/User")
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

if(isDevelopment) {
    app.use(router)
} else {
    app.use("/api", router)
}
app.use(errorHandler)

const port = process.env.SERVER_PORT || 5000
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
