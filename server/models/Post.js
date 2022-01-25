const {Schema, model} = require("../config/mongo")
const types = require("../utils/types/mongoose")

require("./Comment")

const validateComments = postAccess => function(comments) {
    return this.access!==postAccess || !comments.length
}

const postSchema = new Schema({
    text: types.STRING,
    user: types.USER,
    date: types.DATE,
    access: {
        type: String,
        enum: Object.values(types._ACCESS_ENUM),
        required: true
    },
    commentsPublic: {
        type: [types.COMMENT],
        validate: validateComments(types._ACCESS_ENUM.PRIVATE),
        select: false
    },
    commentsPrivate: {
        type: [types.COMMENT],
        validate: validateComments(types._ACCESS_ENUM.PUBLIC),
        select: false
    }
})

const autoPopulate = function (next) {
    this.populate("user")
    next()
}
const sortByDate = function (next) {
    this.sort("-date")
    next()
}
postSchema.pre(["find", "findById"], autoPopulate)
postSchema.pre("find", sortByDate)

module.exports = model(types.POST.ref, postSchema)
