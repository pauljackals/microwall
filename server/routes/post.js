const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const types = require("../utils/types/mongoose")
const authenticationCheck = require("../utils/authenticationCheck")

router.get("/", (req, res, next) => {
    const notPrivatePosts = {access: {$ne: types._ACCESS_ENUM.PRIVATE}}

    const query = req.isAuthenticated() ? Post.find({$or: [
        notPrivatePosts,
        {
            access: types._ACCESS_ENUM.PRIVATE,
            user: {$in: [req.user._id, ...req.user.friends.map(friend => friend._id)]}
        }
    
    ]}).populate("commentsPublic commentsPrivate") : Post.find(notPrivatePosts)

    query.exec().then(posts => {
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
            res.status(201).json({post})
        
        }).catch(err => next(err))
    }).catch(err => next(err))
})

module.exports = router
