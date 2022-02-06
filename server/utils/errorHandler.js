const {ValidationError} = require("mongoose").Error
const {
    MissingPasswordError,
    MissingUsernameError,
    UserExistsError,
    IncorrectPasswordError,
    IncorrectUsernameError
} = require("passport-local-mongoose").errors
const AuthenticationError = require("passport/lib/errors/authenticationerror")
const {
    NotFoundError,
    UserSelfReferenceError,
    FriendError
} = require("../utils/errors")

module.exports = (err, req, res, next) => {
    if(err instanceof ValidationError) {
        res.status(422).json({message: "validation error"})

    } else if (err instanceof SyntaxError) {
        res.status(400).json({message: "invalid syntax"})

    } else if (err instanceof MissingPasswordError) {
        res.status(422).json({message: "password missing"})

    } else if (err instanceof MissingUsernameError) {
        res.status(422).json({message: "username missing"})

    } else if (err instanceof UserExistsError) {
        res.status(409).json({message: "user already exists"})

    } else if (
        err instanceof IncorrectPasswordError ||
        err instanceof IncorrectUsernameError
    ) {
        res.status(409).json({message: "incorrect username or password"})

    } else if (err instanceof AuthenticationError) {
        res.status(401).json({message: "user must be logged in"})

    } else if (err instanceof NotFoundError) {
        res.status(404).json({message: "resource not found"})

    } else if (err instanceof UserSelfReferenceError) {
        res.status(409).json({message: "user must not perform this action on themselves"})

    } else if (err instanceof FriendError) {
        res.status(409).json({message: "error on friend operation"})

    } else {
        res.status(500).json({message: "unknown error"})
        console.error(err);
    }
}