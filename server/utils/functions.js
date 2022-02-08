module.exports = {
    filterUserPassword: user => {
        user.hash = undefined
        user.salt = undefined
        return user
    },
    filterFriend: user => {
        user.posts = undefined
        user.friends = undefined
        user.invitesSent = undefined
        user.invitesReceived = undefined
        return user
    },
    
    wrapMiddleware: middleware => (socket, next) => {
        middleware(socket.request, {}, next);
    }
}
