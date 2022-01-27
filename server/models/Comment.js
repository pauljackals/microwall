const {Schema, model} = require("../config/mongo")
const { STRING, USER, DATE, COMMENT } = require("./types")

const commentSchema = new Schema({
    text: STRING,
    user: USER,
    date: DATE
})

const autoPopulate = function (next) {
    this.populate("user")
    next()
}
commentSchema.pre(["find", "findOne"], autoPopulate)

module.exports = model(COMMENT.ref, commentSchema)
