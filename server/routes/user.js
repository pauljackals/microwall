const User = require("../models/User")
const authenticationCheck = require("../utils/authenticationCheck")
const router = require("express").Router()
const mongoose = require("../config/mongo")

const {
    NotFoundError,
    UserSelfReferenceError,
    FriendError
} = require("../utils/errors")

router.get("/me", authenticationCheck, (req, res) => {
    const user = req.user

    res.status(200).json({user})
})
router.patch("/me", authenticationCheck, (req, res, next) => {
    const user = req.user
    const {
        firstName,
        lastName
    } = req.body

    User.findByIdAndUpdate(user._id, {firstName, lastName}, {new: true}).exec().then(user => {
        res.status(200).json({user})

    }).catch(err => {
        next(err)
    })
})

router.patch("/me/login", authenticationCheck, (req, res, next) => {
    const user = req.user
    const {
        password,
        passwordOld
    } = req.body

    user.changePassword(passwordOld, password, (err, user) => {
        if(err) {
            return next(err)
        }
        res.status(200).json({user})
    })
})

router.get("/", (req, res, next) => {
    User.find().select("username").exec().then(users => {
        res.status(200).json({users})
    
    }).catch(err => next(err))
})

router.get("/:id", (req, res, next) => {
    const {id} = req.params
    User.findById(id).exec().then(user => {
        if(!user) {
            return next(new NotFoundError())
        }
        res.status(200).json({user})

    }).catch(err => next(err))
})

router.patch("/:id/friend", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            friends: {$ne: _id},
            invitationsSent: {$ne: _id},
            invitationsReceived: {$ne: _id}
        },
        {$push: {invitationsReceived: _id}},
        {new: true}
    
    ).then(userInvited => {
        if(!userInvited) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                friends: {$ne: id},
                invitationsSent: {$ne: id},
                invitationsReceived: {$ne: id}
            },
            {$push: {invitationsSent: id}},
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userInvited})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

module.exports = router
