const {Server} = require("socket.io")
const passport = require("passport")
const expressSession = require("./session")
const server = require("./server")
const AuthenticationError = require("passport/lib/errors/authenticationerror")

const wrapMiddleware = middleware => (socket, next) => {
    middleware(socket.request, {}, next);
}

const sio = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        credentials: true
    }
})

sio.ofWrapped = function(namespaceName) {
    const namespace = this.of(namespaceName)
    namespace.use(wrapMiddleware(expressSession))
    namespace.use(wrapMiddleware(passport.initialize()))
    namespace.use(wrapMiddleware(passport.session()))
    namespace.use((socket, next) => {
        if(!socket.request.user) {
            return next(new AuthenticationError())
        }
        next()
    })
    return namespace
}

module.exports = sio
