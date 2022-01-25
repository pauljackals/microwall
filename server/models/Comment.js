const {Schema, model} = require("../config/mongo")
const { STRING, USER, DATE, COMMENT } = require("./types")

const commentSchema = new Schema({
    text: STRING,
    user: USER,
    date: DATE
})

module.exports = model(COMMENT.ref, commentSchema)
