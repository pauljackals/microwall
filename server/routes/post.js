const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const {authenticationCheck, accessPost} = require("../utils/middlewares")
const { POST_ACCESS_ENUM } = require("../models/types")
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
        return User.findByIdAndUpdate(userId, {$push: {
            posts: post._id
        
        }}).exec().then(() => {
            post.user = req.user
            res.status(201).json({post})
        })
        
    }).catch(err => next(err))
})

router.get("/:id", authenticationCheck, accessPost, (req, res) => {
    const {post} = req
    res.status(200).json({post})
})

router.post("/:id", authenticationCheck, accessPost, (req, res, next) => {
    const {post, body: {text}} = req

    const comment = new Comment({text, user: req.user._id, post: post._id})

    comment.save().then(comment => {
        if(post.commentsPrivate) {
            post.commentsPrivate.unshift(comment._id)
        } else {
            post.commentsPublic.unshift(comment._id)
        }
        return post.save().then(() => {
            if(req.user._id.toString()!==post.user._id.toString()) {
                const isPrivate = post.access!==POST_ACCESS_ENUM.GENERAL ? undefined : !!post.commentsPrivate
                sio.of(`/user/${post.user._id}`).emit("comment", JSON.stringify({comment, isPrivate}))
            }
            sio.of(`/post/${post._id}`).emit("comment", JSON.stringify({comment}))
            res.status(201).json({comment})
        })
        
    }).catch(err => next(err))
})

module.exports = router
