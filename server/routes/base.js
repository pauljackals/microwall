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

module.exports = router
