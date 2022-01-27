const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const authenticationCheck = require("../utils/authenticationCheck")
const { POST_ACCESS_ENUM } = require("../models/types")
const {NotFoundError} = require("../utils/errors")
const Comment = require("../models/Comment")
const sio = require("../namespaces/namespaces")

router.get("/", (req, res, next) => {
    const isAuthenticated = req.isAuthenticated()
    const notPrivatePosts = {access: {$ne: POST_ACCESS_ENUM.PRIVATE}}

    const query = isAuthenticated ? Post.find({$or: [
        notPrivatePosts,
        {
            access: POST_ACCESS_ENUM.PRIVATE,
            user: {$in: [req.user._id, ...req.user.friends.map(friend => friend._id)]}
        }
    
    ]}).select("+commentsPublic +commentsPrivate") : Post.find(notPrivatePosts)

    query.exec().then(posts => {
        if(isAuthenticated) {
            posts.forEach(post => {
                if(post.access===POST_ACCESS_ENUM.GENERAL && post.user._id.toString()!==req.user._id.toString() && !req.user.friends.some(friend => friend._id.toString() === post.user._id.toString())){
                    post.commentsPrivate = undefined
                }
            })
        }
        res.status(200).json({posts})

    }).catch(err => next(err))
})

router.post("/", authenticationCheck, (req, res, next) => {
    const {text, access, links, images} = req.body
    const userId = req.user._id

    const post = new Post({text, access, user: userId, links, images})
    post.save().then(post => {
        User.findByIdAndUpdate(userId, {$push: {
            posts: post._id
        
        }}).exec().then(() => {
            post.user = req.user
            res.status(201).json({post})
        
        }).catch(err => next(err))
    }).catch(err => next(err))
})

router.get("/:id", authenticationCheck, (req, res, next) => {
    const {id} = req.params

    const isPrivateRaw = req.query.isPrivate
    if(!["true", "false", undefined].includes(isPrivateRaw)) {
        return next(new Error())
    }
    const isPrivate = !isPrivateRaw ? undefined : !!(isPrivateRaw==="true")

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
        res.status(200).json({post})
    
    }).catch(err => next(err))
})

router.post("/:id", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {text} = req.body

    const isPrivateRaw = req.query.isPrivate
    if(!["true", "false", undefined].includes(isPrivateRaw)) {
        return next(new NotFoundError())
    }
    const isPrivate = !isPrivateRaw ? undefined : !!(isPrivateRaw==="true")

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
            throw new NotFoundError()
        }
        const comment = new Comment({text, user: req.user._id, post: id})
        comment.save().then(comment => {
            if(post.access===POST_ACCESS_ENUM.PRIVATE || post.access===POST_ACCESS_ENUM.GENERAL && isPrivate) {
                post.commentsPrivate.unshift(comment._id)
            } else {
                post.commentsPublic.unshift(comment._id)
            }
            post.save().then(() => {
                if(req.user._id.toString()!==post.user._id.toString()) {
                    sio.ofWrapped(`/user/${post.user._id}`).emit("comment", JSON.stringify({comment, isPrivate}))
                }
                sio.ofWrapped(`/post/${post._id}`).emit("comment", JSON.stringify({comment, isPrivate}))
                res.status(201).json({comment})
            })
        })

    }).catch(err => next(err))
})

module.exports = router
