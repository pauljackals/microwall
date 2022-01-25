const {Schema, model} = require("../config/mongo")
const types = require("../utils/types/mongoose")

const commentSchema = new Schema({
    text: types.STRING,
    user: types.USER,
    date: types.DATE
})

module.exports = model(types.COMMENT.ref, commentSchema)
