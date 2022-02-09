const sio = require("../config/socket")
const AuthenticationError = require("passport/lib/errors/authenticationerror")
const { accessPost, authenticationCheck } = require("../utils/middlewares")
const { wrapMiddleware } = require("../utils/functions")

const authenticationCheckWrapped = wrapMiddleware(authenticationCheck)

sio.of(/^\/user\/[a-fA-F0-9]{24}$/).use(authenticationCheckWrapped).use((socket, next) => {
    if(socket.request.user._id.toString() !== socket.nsp.name.split("/")[2]) {
        return next(new AuthenticationError())
    }
    next()
})
    .on("connect", socket => {
        const {username} = socket.request.user
        console.log(username, "login")
        socket.on("disconnect", () => console.log(username, "logout"))
    })

sio.of(/^\/post\/[a-fA-F0-9]{24}$/).use(authenticationCheckWrapped).use((socket, next) => {
    const {isPrivate} = socket.handshake.query

    const {request} = socket
    request.params = {id: socket.nsp.name.split("/")[2]}
    request.query = {isPrivate}

    wrapMiddleware(accessPost)(socket, next)
    // accessPost(request, {}, next)
})
    .on("connect", socket => {
        const {username} = socket.request.user
        console.log(username, "enter post")
        socket.on("disconnect", () => console.log(username, "leave post"))
    })

sio.of("/post")
    .on("connect", socket => {
        const {username} = socket.request.user ?? {}
        console.log(username, "enter main wall")
        socket.on("disconnect", () => console.log(username, "leave main wall"))
    })

sio.of(/^\/user\/[a-fA-F0-9]{24}\/public$/)
    .on("connect", socket => {
        const {username} = socket.request.user ?? {}
        console.log(username, "enter public wall")
        socket.on("disconnect", () => console.log(username, "leave public wall"))
    })

sio.of(/^\/user\/[a-fA-F0-9]{24}\/private$/).use(authenticationCheckWrapped).use((socket, next) => {
    const id = socket.nsp.name.split("/")[2]
    if(socket.request.user.friends.find(friend => friend._id.toString() === id)) {
        return next()
    }
    next(new AuthenticationError())
})
    .on("connect", socket => {
        const {username} = socket.request.user ?? {}
        console.log(username, "enter private wall")
        socket.on("disconnect", () => console.log(username, "leave private wall"))
    })

module.exports = sio
