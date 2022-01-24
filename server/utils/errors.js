const generateError = name => {
    function error(message) {
        const instance = new Error(message);
        instance.name = name
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
        return instance
    }
    error.prototype = Object.create(Error.prototype, {
        constructor: {
            value: error
        }
    })
    return error
}

module.exports = [
    "NotFoundError",
    "UserSelfReferenceError",
    "FriendError"

].reduce((object, error) => {
    object[error] = generateError(error)
    return object
}, {})
