const User = require("../models/User")
const {authenticationCheck} = require("../utils/middlewares")
const router = require("express").Router()
const { POST_ACCESS_ENUM } = require("../models/types")
const sio = require("../namespaces/namespaces")

const {
    NotFoundError,
    UserSelfReferenceError,
    FriendError
} = require("../utils/errors")
const { filterFriend } = require("../utils/functions")

// router.get("/test", (req, res) => {
//     sio.of("/user/62015bdc32a1fc8fbcce4f90").fetchSockets().then(x => console.log(x[0].client.conn.request))
//     res.json()
// })

router.get("/me", authenticationCheck, (req, res) => {
    const user = req.user

    res.status(200).json({user})
})

router.patch("/me", authenticationCheck, (req, res, next) => {
    const user = req.user
    const {
        firstName,
        lastName,
        // username
    } = req.body

    User.findByIdAndUpdate(
        user._id,
        {
            firstName,
            lastName,
            // username
        },
        {
            new: true,
            runValidators: true
        }

    ).exec().then(user => {
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
    const select = req.isAuthenticated() ? {select: "+commentsPublic +commentsPrivate"} : {}

    User.findById(id).select(`+friends`).populate({path:"posts", options:{sort:{date:1}}, ...select}).exec().then(user => {
        if(!user) {
            return next(new NotFoundError())
        }
        user.posts = user.posts.filter(post => post.access!==POST_ACCESS_ENUM.PRIVATE || req.isAuthenticated() && user.friends.includes(req.user.id))
        if(req.isAuthenticated()) {
            user.posts.forEach(post => {
                if(post.access===POST_ACCESS_ENUM.GENERAL && post.user._id.toString()!==req.user._id.toString() && !req.user.friends.some(friend => friend._id.toString()===post.user._id.toString())){
                    post.commentsPrivate = undefined
                }
            })
        }
        user.friends = undefined
        res.status(200).json({user})

    }).catch(err => next(err))
})

router.patch("/:id/friend/add", authenticationCheck, (req, res, next) => {
    const {
        params: {id: idFriend},
        user,
        user: {_id: idUser}
    } = req

    if(idFriend===idUser.toString()){
        return next(new UserSelfReferenceError())
    }
    if([user.friends, user.invitesSent, user.invitesReceived].some(friends =>
        friends.some(friend => friend._id.toString() === idFriend)
    )) {
        return next(new FriendError())
    }

    User.findOneAndUpdate(
        {
            _id: idFriend,
            friends: {$ne: idUser},
            invitesSent: {$ne: idUser},
            invitesReceived: {$ne: idUser}
        },
        {$push: {invitesReceived: idUser}},
        {new: true}
    
    ).exec().then(userInvited => {
        if(!userInvited) {
            throw new FriendError()
        }

        user.invitesSent.push(idFriend)
        return user.save().then(user => {
            if(!user) {
                throw new FriendError()
            }
            sio.of(`/user/${idFriend}`).emit("friendAdd", {user: filterFriend(user)})
            res.status(200).json({user: userInvited})
        })

    }).catch(err => next(err))
})

router.patch("/:id/friend/decline", authenticationCheck, (req, res, next) => {
    const {
        params: {id: idFriend},
        user,
        user: {_id: idUser}
    } = req

    if(idFriend===idUser.toString()){
        return next(new UserSelfReferenceError())
    }
    if(user.invitesReceived.every(friend => friend._id.toString() !== idFriend)){
        return next(new FriendError())
    }

    User.findOneAndUpdate(
        {
            _id: idFriend,
            invitesSent: {$eq: idUser}
        },
        {$pull: {invitesSent: idUser}},
        {new: true}
    
    ).then(userDeclined => {
        if(!userDeclined) {
            throw new FriendError()
        }

        user.invitesReceived.splice(user.invitesReceived.findIndex(user => user._id.toString()===idFriend), 1)
        return user.save().then(user => {
            if(!user) {
                throw new FriendError()
            }
            sio.of(`/user/${idFriend}`).emit("friendDecline", {user: filterFriend(user)})
            res.status(200).json({user: userDeclined})
        })

    }).catch(err => next(err))
})

router.patch("/:id/friend/accept", authenticationCheck, (req, res, next) => {
    const {
        params: {id: idFriend},
        user,
        user: {_id: idUser}
    } = req

    if(idFriend===idUser.toString()){
        return next(new UserSelfReferenceError())
    }
    if(user.invitesReceived.every(friend => friend._id.toString() !== idFriend)){
        return next(new FriendError())
    }

    User.findOneAndUpdate(
        {
            _id: idFriend,
            invitesSent: {$eq: idUser}
        },
        {
            $pull: {invitesSent: idUser},
            $push: {friends: idUser}
        },
        {new: true}
    
    ).then(userAccepted => {
        if(!userAccepted) {
            throw new FriendError()
        }

        user.invitesReceived.splice(user.invitesReceived.findIndex(user => user._id.toString()===idFriend), 1)
        user.friends.push(idFriend)
        return user.save().then(user => {
            if(!user) {
                throw new FriendError()
            }
            sio.of(`/user/${idFriend}`).emit("friendAccept", {user: filterFriend(user)})
            res.status(200).json({user: userAccepted})
        })

    }).catch(err => next(err))
})

router.patch("/:id/friend/remove", authenticationCheck, (req, res, next) => {
    const {
        params: {id: idFriend},
        user,
        user: {_id: idUser}
    } = req

    if(idFriend===idUser.toString()){
        return next(new UserSelfReferenceError())
    }
    if(user.friends.every(friend => friend._id.toString() !== idFriend)){
        return next(new FriendError())
    }

    User.findOneAndUpdate(
        {
            _id: idFriend,
            friends: {$eq: idUser}
        },
        {$pull: {friends: idUser}},
        {new: true}
    
    ).then(userRemoved => {
        if(!userRemoved) {
            throw new FriendError()
        }

        user.friends.splice(user.friends.findIndex(user => user._id.toString()===idFriend), 1)
        const posts = [...user.posts]
        return user.save().then(user => {
            if(!user) {
                throw new FriendError()
            }
            sio.of(`/user/${idFriend}`).emit("friendRemove", {user: filterFriend(user)})

            const disconnectSockets = (namespace, idListener, extraSocketCheck=()=>true) => sio.of(namespace).fetchSockets().then(sockets => {
                sockets.forEach(socket => {
                    if(socket.client.conn.request.user._id.toString()===idListener && extraSocketCheck(socket)) {
                        socket.disconnect()
                    }
                })
            })
            disconnectSockets(`/user/${idUser}/private`, idFriend)
            disconnectSockets(`/user/${idFriend}/private`, idUser.toString())
            posts.forEach(post => {
                if(post.access!==POST_ACCESS_ENUM.PUBLIC) {
                    const extraSocketCheck = post.access===POST_ACCESS_ENUM.GENERAL
                        ? socket => socket.client.conn.request.query.isPrivate==="true"
                        : ()=>true
                    disconnectSockets(`/post/${post._id}`, idFriend, extraSocketCheck)
                }
            })
            
            res.status(200).json({user: userRemoved})
        })

    }).catch(err => next(err))
})

router.patch("/:id/friend/cancel", authenticationCheck, (req, res, next) => {
    const {
        params: {id: idFriend},
        user,
        user: {_id: idUser}
    } = req

    if(idFriend===idUser.toString()){
        return next(new UserSelfReferenceError())
    }
    if(user.invitesSent.every(friend => friend._id.toString() !== idFriend)){
        return next(new FriendError())
    }

    User.findOneAndUpdate(
        {
            _id: idFriend,
            invitesReceived: {$eq: idUser}
        },
        {$pull: {invitesReceived: idUser}},
        {new: true}
    
    ).then(userRemoved => {
        if(!userRemoved) {
            throw new FriendError()
        }

        user.invitesSent.splice(user.invitesSent.findIndex(user => user._id.toString()===idFriend), 1)
        return user.save().then(user => {
            if(!user) {
                throw new FriendError()
            }
            sio.of(`/user/${idFriend}`).emit("friendCancel", {user: filterFriend(user)})
            res.status(200).json({user: userRemoved})
        })

    }).catch(err => next(err))
})

module.exports = router
