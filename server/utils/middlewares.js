const AuthenticationError = require("passport/lib/errors/authenticationerror")
const Post = require("../models/Post")
const { POST_ACCESS_ENUM } = require("../models/types")
const {NotFoundError} = require("../utils/errors")

module.exports = {
    authenticationCheck: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next(new AuthenticationError())
        }
        next()
    },

    accessPost: (req, res, next) => {
        const {id} = req.params
    
        const isPrivateRaw = req.query.isPrivate
        const isPrivate = isPrivateRaw==="true" ? true : (isPrivateRaw==="false" ? false : isPrivateRaw)

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
                user: {$in: [req.user._id, ...req.user.friends.map(friend => friend._id)]}
            }
    
        ]}).populate("commentsPublic commentsPrivate").exec().then(post => {
            if(!post || post.access===POST_ACCESS_ENUM.GENERAL && isPrivate===undefined) {
                return next(new NotFoundError())
            }
            if(post.access===POST_ACCESS_ENUM.GENERAL) {
                if(isPrivate===true) {
                    post.commentsPublic = undefined
                } else if(isPrivate===false) {
                    post.commentsPrivate = undefined
                }
            }
            req.post = post
            next()
        
        }).catch(err => next(err))
    }
}
