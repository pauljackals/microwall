const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const authenticationCheck = require("../utils/authenticationCheck")
const { POST_ACCESS_ENUM } = require("../models/types")

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
                if(post.access===POST_ACCESS_ENUM.GENERAL && post.user._id.toString()!==req.user._id.toString() && !req.user.friends.includes(post.user._id)){
                    post.commentsPrivate = undefined
                }
            })
        }
        res.status(200).json({posts})

    }).catch(err => next(err))
})

router.post("/", authenticationCheck, (req, res, next) => {
    const {text, access} = req.body
    const userId = req.user._id

    const post = new Post({text, access, user: userId})
    post.save().then(post => {
        User.findByIdAndUpdate(userId, {$push: {
            posts: post._id
        
        }}).exec().then(() => {
            post.user = req.user
            res.status(201).json({post})
        
        }).catch(err => next(err))
    }).catch(err => next(err))
})

module.exports = router
