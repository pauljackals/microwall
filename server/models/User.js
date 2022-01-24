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
    invitationsSent: {
        type: [types.USER],
        select: false
    },
    invitationsReceived: {
        type: [types.USER],
        select: false
    }
})
userSchema.plugin(passportLocalMongoose, {
    populateFields: "friends invitationsSent invitationsReceived"
})

module.exports = model("User", userSchema)
