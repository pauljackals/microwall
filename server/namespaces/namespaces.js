const sio = require("../config/socket")
const AuthenticationError = require("passport/lib/errors/authenticationerror")
const { accessPost, authenticationCheck } = require("../utils/middlewares")
const { wrapMiddleware } = require("../utils/functions")

const authenticationCheckWrapped = wrapMiddleware(authenticationCheck)

const getId = socket => socket.nsp.name.split("/")[2]

sio.of(/^\/user\/[a-fA-F0-9]{24}$/).use(authenticationCheckWrapped).use((socket, next) => {
    if(socket.request.user._id.toString() !== getId(socket)) {
        return next(new AuthenticationError())
    }
    next()
})

sio.of(/^\/post\/[a-fA-F0-9]{24}$/).use(authenticationCheckWrapped).use((socket, next) => {
    const {isPrivate} = socket.handshake.query

    const {request} = socket
    request.params = {id: getId(socket)}
    request.query = {isPrivate}

    wrapMiddleware(accessPost)(socket, next)
})

sio.of("/post")

sio.of(/^\/user\/[a-fA-F0-9]{24}\/public$/)

sio.of(/^\/user\/[a-fA-F0-9]{24}\/private$/).use(authenticationCheckWrapped).use((socket, next) => {
    const id = getId(socket)
    if(socket.request.user.friends.find(friend => friend._id.toString() === id)) {
        return next()
    }
    next(new AuthenticationError())
})

module.exports = sio
