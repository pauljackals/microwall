const {SchemaTypes} = require("mongoose")

module.exports = {
    STRING: {
        type: String,
        required: true,
        maxLength: 128,
        minLength: 1
    },
    USER: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    COMMENT: {
        type: SchemaTypes.ObjectId,
        ref: "Comment",
        required: true
    },
    POST: {
        type: SchemaTypes.ObjectId,
        ref: "Post",
        required: true
    },
    DATE: {
        type: Date,
        default: Date.now
    },

    POST_ACCESS_ENUM: {
        PRIVATE: "PRIVATE",
        PUBLIC: "PUBLIC",
        GENERAL: "GENERAL"
    }
}
