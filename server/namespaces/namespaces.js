const sio = require("../config/socket")
const AuthenticationError = require("passport/lib/errors/authenticationerror")

sio.ofWrapped(/^\/user\/[a-fA-F0-9]{24}$/).use((socket, next) => {
    if(socket.request.user._id.toString() !== socket.nsp.name.slice(6)) {
        return next(new AuthenticationError())
    }
    next()

}).on("connection", socket => {
    console.log(`${socket.request.user.username} connected`);

    socket.on("disconnect", () => {
        console.log(`${socket.request.user.username} disconnected`);
    })
})

module.exports = sio
