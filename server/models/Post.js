const {Schema, model} = require("../config/mongo")
const { STRING, USER, DATE, POST_ACCESS_ENUM, POST, COMMENT } = require("./types")

const validateComments = postAccess => function(comments) {
    return this.access===postAccess && !comments || !!comments
}
const validateUrl = url => {
    try {
        return !!(new URL(url))
    } catch(err) {
        return false
    }
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
        select: false,
        default() {
            return this.access!==POST_ACCESS_ENUM.PRIVATE ? [] : undefined
        }
    },
    commentsPrivate: {
        type: [COMMENT],
        validate: validateComments(POST_ACCESS_ENUM.PUBLIC),
        select: false,
        default() {
            return this.access!==POST_ACCESS_ENUM.PUBLIC ? [] : undefined
        }
    },
    links: {
        type: [{
            ...STRING,
            validate: validateUrl
        }]
    },
    images: {
        type: [{
            ...STRING,
            validate: validateUrl
        }]
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
postSchema.pre(["find", "findOne"], autoPopulate)
postSchema.pre("find", sortByDate)

module.exports = model(POST.ref, postSchema)
