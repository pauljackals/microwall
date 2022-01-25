const {Schema, model} = require("../config/mongo")
const passportLocalMongoose = require("passport-local-mongoose")
const { USER, STRING, POST } = require("./types")

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

userSchema.plugin(passportLocalMongoose, {
    populateFields: {path: "friends invitesSent invitesReceived posts", options: {sort:{"posts.date":1}}}
})

module.exports = model(USER.ref, userSchema)
