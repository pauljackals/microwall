const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

module.exports = (err, req, res, next) => {
    if(err instanceof mongoose.Error.ValidationError) {
        res.status(422).json({message: "validation error"})

    } else if (err instanceof SyntaxError) {
        res.status(400).json({message: "invalid syntax"})

    } else if (err instanceof passportLocalMongoose.errors.MissingPasswordError) {
        res.status(422).json({message: "password missing"})

    } else if (err instanceof passportLocalMongoose.errors.MissingUsernameError) {
        res.status(422).json({message: "username missing"})

    } else if (err instanceof passportLocalMongoose.errors.UserExistsError) {
        res.status(409).json({message: "user already exists"})

    } else if (
        err instanceof passportLocalMongoose.errors.IncorrectPasswordError ||
        err instanceof passportLocalMongoose.errors.IncorrectUsernameError
    ) {
        res.status(409).json({message: "incorrect username or password"})

    } else {
        res.status(500).json({message: "unknown error"})
        console.error(err);
    }
}