const {Server} = require("socket.io")
const passport = require("passport")
const expressSession = require("./session")
const server = require("./server")
const isDevelopment = require("./isDevelopment")
const { wrapMiddleware } = require("../utils/functions")
// const { authenticationCheck } = require("../utils/middlewares")

const sio = new Server(server, {
    cors: {
        origin: isDevelopment ? `http://localhost:${process.env.CLIENT_PORT || 8080}` : undefined,
        credentials: true
    }
})

sio.ofOriginal = sio.of
sio.of = function(namespaceName) {
    const namespace = this.ofOriginal(namespaceName)
    namespace.use(wrapMiddleware(expressSession))
    namespace.use(wrapMiddleware(passport.initialize()))
    namespace.use(wrapMiddleware(passport.session()))
    // namespace.use(wrapMiddleware(authenticationCheck))
    return namespace
}

module.exports = sio
