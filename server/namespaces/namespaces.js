const sio = require("../config/socket")
const AuthenticationError = require("passport/lib/errors/authenticationerror")
const { accessPost } = require("../utils/middlewares")

sio.of(/^\/user\/[a-fA-F0-9]{24}$/).use((socket, next) => {
    if(socket.request.user._id.toString() !== socket.nsp.name.slice(6)) {
        return next(new AuthenticationError())
    }
    next()
})

sio.of(/^\/post\/[a-fA-F0-9]{24}$/).use((socket, next) => {
    const id = socket.nsp.name.slice(6)
    const {isPrivate} = socket.handshake.query

    const {request} = socket
    request.params = {id}
    request.query = {isPrivate}

    accessPost(request, {}, next)
})

module.exports = sio
