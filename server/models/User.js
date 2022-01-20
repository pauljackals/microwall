const {Schema, model} = require("../config/mongo")
const passportLocalMongoose = require("passport-local-mongoose")
const types = require("../utils/types/mongoose")

const userSchema = new Schema({
    firstName: types.STRING,
    lastName: types.STRING
})
userSchema.plugin(passportLocalMongoose)

module.exports = model("User", userSchema)
