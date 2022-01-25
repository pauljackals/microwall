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
        type: [POST]
    }
})
userSchema.plugin(passportLocalMongoose, {
    populateFields: "friends invitesSent invitesReceived"
})

module.exports = model(USER.ref, userSchema)
