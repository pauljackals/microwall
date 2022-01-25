const {Schema, model} = require("../config/mongo")
const { STRING, USER, DATE, POST_ACCESS_ENUM, POST, COMMENT } = require("./types")

require("./Comment")

const validateComments = postAccess => function(comments) {
    return this.access!==postAccess || !comments.length
}

const postSchema = new Schema({
    text: STRING,
    user: USER,
    date: DATE,
    access: {
        type: String,
        enum: Object.values(POST_ACCESS_ENUM),
        required: true
    },
    commentsPublic: {
        type: [COMMENT],
        validate: validateComments(POST_ACCESS_ENUM.PRIVATE),
        select: false
    },
    commentsPrivate: {
        type: [COMMENT],
        validate: validateComments(POST_ACCESS_ENUM.PUBLIC),
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

module.exports = model(POST.ref, postSchema)
