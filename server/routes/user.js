const User = require("../models/User")
const authenticationCheck = require("../utils/authenticationCheck")
const router = require("express").Router()
const { POST_ACCESS_ENUM } = require("../models/types")

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
    const options = req.isAuthenticated() ? {_id: {$ne: req.user._id}} : {}
    
    User.find(options).select("-posts").exec().then(users => {
        res.status(200).json({users})
    
    }).catch(err => next(err))
})

router.get("/:id", (req, res, next) => {
    const {id} = req.params
    User.findById(id).select("+friends").populate({path:"posts", options:{sort:{date:1}}}).exec().then(user => {
        if(!user) {
            return next(new NotFoundError())
        }
        user.posts = user.posts.filter(post => post.access!==POST_ACCESS_ENUM.PRIVATE || req.isAuthenticated() && user.friends.includes(req.user.id))
        user.friends = undefined
        res.status(200).json({user})

    }).catch(err => next(err))
})

router.patch("/:id/friend/add", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            friends: {$ne: _id},
            invitesSent: {$ne: _id},
            invitesReceived: {$ne: _id}
        },
        {$push: {invitesReceived: _id}},
        {new: true}
    
    ).then(userInvited => {
        if(!userInvited) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                friends: {$ne: id},
                invitesSent: {$ne: id},
                invitesReceived: {$ne: id}
            },
            {$push: {invitesSent: id}},
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userInvited})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

router.patch("/:id/friend/decline", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            invitesSent: {$eq: _id}
        },
        {$pull: {invitesSent: _id}},
        {new: true}
    
    ).then(userDeclined => {
        if(!userDeclined) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                invitesReceived: {$eq: id}
            },
            {$pull: {invitesReceived: id}},
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userDeclined})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

router.patch("/:id/friend/accept", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            invitesSent: {$eq: _id}
        },
        {
            $pull: {invitesSent: _id},
            $push: {friends: _id}

        },
        {new: true}
    
    ).then(userAccepted => {
        if(!userAccepted) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                invitesReceived: {$eq: id}
            },
            {
                $pull: {invitesReceived: id},
                $push: {friends: id}
            },
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userAccepted})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

router.patch("/:id/friend/remove", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            friends: {$eq: _id}
        },
        {$pull: {friends: _id}},
        {new: true}
    
    ).then(userRemoved => {
        if(!userRemoved) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                friends: {$eq: id}
            },
            {$pull: {friends: id}},
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userRemoved})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

router.patch("/:id/friend/cancel", authenticationCheck, (req, res, next) => {
    const {id} = req.params
    const {_id} = req.user

    if(id===_id.toString()){
        return next(new UserSelfReferenceError())
    }

    User.findOneAndUpdate(
        {
            _id: id,
            invitesReceived: {$eq: _id}
        },
        {$pull: {invitesReceived: _id}},
        {new: true}
    
    ).then(userRemoved => {
        if(!userRemoved) {
            throw new FriendError()
        }
        User.findOneAndUpdate(
            {
                _id,
                invitesSent: {$eq: id}
            },
            {$pull: {invitesSent: id}},
            {new: true}
            
        ).then(user => {
            if(!user) {
                throw new FriendError()
            }
            res.status(200).json({user: userRemoved})

        }).catch(err => next(err))

    }).catch(err => next(err))
})

module.exports = router
