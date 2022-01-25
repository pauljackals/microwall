const {Schema, model} = require("../config/mongo")
const passportLocalMongoose = require("passport-local-mongoose")
const types = require("../utils/types/mongoose")

const userSchema = new Schema({
    firstName: types.STRING,
    lastName: types.STRING,
    friends: {
        type: [types.USER],
        select: false
    },
    invitesSent: {
        type: [types.USER],
        select: false
    },
    invitesReceived: {
        type: [types.USER],
        select: false
    },
    posts: {
        type: [types.POST]
    }
})
userSchema.plugin(passportLocalMongoose, {
    populateFields: "friends invitesSent invitesReceived"
})

module.exports = model(types.USER.ref, userSchema)
