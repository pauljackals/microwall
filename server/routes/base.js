const passport = require("passport")
const User = require("../models/User")
const {authenticationCheck} = require("../utils/middlewares")
const { filterUserPassword } = require("../utils/functions")
const router = require("express").Router()
const sio = require("../namespaces/namespaces")

router.post("/register", (req, res, next) => {
    const {
        username,
        password,
        firstName,
        lastName
    } = req.body

    User.register(new User({
        username,
        firstName,
        lastName
    }), password, (err, userSaved) => {

        if(err) {
            return next(err)
        }
        const user = filterUserPassword(userSaved)
        res.status(201).json({user})
    })
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) {
            return next(err)

        } else if (!user) {
            return next(info)
        }
        req.login(user, (err) => {
            if(err) {
                return next(err)
            }
            const userSafe = filterUserPassword(user)
            res.status(201).json({user: userSafe})
        })
    })(req, res, next)
})

router.delete("/logout", authenticationCheck, (req, res) => {
    const {sessionID} = req
    
    req.logout()
    req.session.destroy(() => {
        res.clearCookie("connect.sid");

        const disconnectSocket = namespace => sio.of(namespace).fetchSockets().then(sockets => {
            const socket = sockets.find(socket => socket.client.conn.request.sessionID === sessionID)
            if(socket) {
                socket.disconnect()
            }
        })
        const namespaces = [...sio._nsps.keys()]
        namespaces.forEach(disconnectSocket)

        res.status(200).json({message: "logged out"})
    })
    
})

module.exports = router
