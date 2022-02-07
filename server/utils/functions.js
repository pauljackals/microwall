module.exports = {
    makeUserSafe: user => {
        user.hash = undefined
        user.salt = undefined
        return user
    },
    
    wrapMiddleware: middleware => (socket, next) => {
        middleware(socket.request, {}, next);
    }
}
