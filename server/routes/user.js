const User = require("../models/User")
const authenticationCheck = require("../utils/authenticationCheck")
const router = require("express").Router()

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

    User.findByIdAndUpdate(user._id, {firstName, lastName}, {new: true}, (err, doc) => {
        if(err) {
            return next(err)
        }
        res.status(200).json({user: doc})
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

module.exports = router
