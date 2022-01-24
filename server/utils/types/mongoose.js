const {SchemaTypes} = require("mongoose")

module.exports = {
    STRING: {
        type: String,
        required: "required",
        maxLength: 128
    },
    USER: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    }
}
