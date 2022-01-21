const AuthenticationError = require("passport/lib/errors/authenticationerror")

module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next(new AuthenticationError())
    }
    next()
}
