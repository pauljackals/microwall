const passport = require("passport")
const User = require("../models/User")
const {authenticationCheck} = require("../utils/middlewares")
const { makeUserSafe } = require("../utils/functions")
const router = require("express").Router()

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
        const user = makeUserSafe(userSaved)
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
            const userSafe = makeUserSafe(user)
            res.status(201).json({user: userSafe})
        })
    })(req, res, next)
})

router.delete("/logout", authenticationCheck, (req, res) => {
    req.logout()
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({message: "logged out"})
    })
    
})

module.exports = router
