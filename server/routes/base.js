const passport = require("passport")
const User = require("../models/User")
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
    }), password, (err, user) => {

        if(err) {
            return next(err)
        }
        user.hash = undefined
        user.salt = undefined
        res.status(201).json({user})
    })
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) {
            return next(err)

        } else if (!user) {
            err = new Error("!user")
            return next(err)
        }
        req.login(user, (err) => {
            if(err) {
                return next(err)
            }
            user.hash = undefined
            user.salt = undefined
            res.status(201).json({user})
        })
    })(req, res, next)
})

router.delete("/logout", (req, res) => {
    req.logout()
    res.status(200).json({message: "logged out"})
})

module.exports = router
