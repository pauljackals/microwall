const router = require("express").Router()
const base = require("./base")
const user = require("./user")
const {NotFoundError} = require("../utils/errors")

router.use("/", base)
router.use("/user", user)

router.use((req, res, next) => {
    next(new NotFoundError())
})

module.exports = router
