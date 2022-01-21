const router = require("express").Router()
const base = require("./base")
const user = require("./user")

router.use("/", base)
router.use("/user", user)

module.exports = router
