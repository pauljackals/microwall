const {Schema, model} = require("../config/mongo")
const passportLocalMongoose = require("passport-local-mongoose")
const { USER, STRING, POST } = require("./types")
const {ValidationError} = require("mongoose").Error

const userSchema = new Schema({
    firstName: STRING,
    lastName: STRING,
    friends: {
        type: [USER],
        select: false
    },
    invitesSent: {
        type: [USER],
        select: false
    },
    invitesReceived: {
        type: [USER],
        select: false
    },
    posts: {
        type: [POST],
        select: false
    }
})

const passwordValidator = (password, cb) => {
    if(password && password.length > 256) {
        return cb(new ValidationError("password too long"))
    }
    cb()
}

userSchema.plugin(passportLocalMongoose, {
    populateFields: {path: "friends invitesSent invitesReceived posts", options: {sort:{"posts.date":1}}, select:"+commentsPublic +commentsPrivate"},
    passwordValidator
})

module.exports = model(USER.ref, userSchema)
