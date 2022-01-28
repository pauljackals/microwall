const sio = require("../config/socket")
const AuthenticationError = require("passport/lib/errors/authenticationerror")
const {NotFoundError} = require("../utils/errors")
const Post = require("../models/Post")
const {POST_ACCESS_ENUM} = require("../models/types")

sio.ofWrapped(/^\/user\/[a-fA-F0-9]{24}$/).use((socket, next) => {
    if(socket.request.user._id.toString() !== socket.nsp.name.slice(6)) {
        return next(new AuthenticationError())
    }
    next()

})

sio.ofWrapped(/^\/post\/[a-fA-F0-9]{24}$/).use((socket, next) => {
    const id = socket.nsp.name.slice(6)
    const isPrivate = socket.handshake.auth.isPrivate
    if(![true, false, undefined].includes(isPrivate)) {
        return next(new NotFoundError())
    }

    Post.findOne({$or: [
        {
            _id: id,
            access: {$in: [
                POST_ACCESS_ENUM.PUBLIC,
                ...(!isPrivate ? [POST_ACCESS_ENUM.GENERAL] : [])
            ]}
        },
        {
            _id: id,
            access: {$in: [
                POST_ACCESS_ENUM.PRIVATE,
                ...(isPrivate ? [POST_ACCESS_ENUM.GENERAL] : [])
            ]},
            user: {$in: [socket.request.user._id, ...socket.request.user.friends.map(friend => friend._id)]}
        }

    ]}).exec().then(post => {
        if(!post || post.access===POST_ACCESS_ENUM.GENERAL && isPrivate===undefined) {
            return next(new NotFoundError())
        }
        next()
    
    }).catch(err => next(err))
})

module.exports = sio
