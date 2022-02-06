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

const maxlengthValidator = (maxlength=32) => field => {
    if(field && field.length > maxlength) {
        return false
    }
    return true
}
const passwordValidator = (password, cb) => {
    const maxlength = 256
    if(!maxlengthValidator(maxlength)(password)) {
        return cb(new ValidationError(`password must not be longer than ${maxlength}`))
    }
    cb()
}

userSchema.plugin(passportLocalMongoose, {
    populateFields: {path: "friends invitesSent invitesReceived posts", options: {sort:{"posts.date":1}}, select:"+commentsPublic +commentsPrivate"},
    passwordValidator
})

userSchema.path("username").validate(maxlengthValidator())

module.exports = model(USER.ref, userSchema)
