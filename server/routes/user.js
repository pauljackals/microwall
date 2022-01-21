const authenticationCheck = require("../utils/authenticationCheck")
const router = require("express").Router()

router.get("/me", authenticationCheck, (req, res) => {
    const user = req.user
    user.hash = undefined
    user.salt = undefined

    res.status(200).json({user})
})

module.exports = router
