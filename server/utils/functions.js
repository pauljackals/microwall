module.exports = {
    makeUserSafe: user => {
        user.hash = undefined
        user.salt = undefined
        return user
    }
}
