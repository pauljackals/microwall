const {Schema, model} = require("../config/mongo")
const { STRING, USER, DATE, COMMENT, POST } = require("./types")

const commentSchema = new Schema({
    text: STRING,
    user: USER,
    date: DATE,
    post: POST
})

const autoPopulate = function (next) {
    this.populate("user")
    next()
}
commentSchema.pre(["find", "findOne", "save"], autoPopulate)

module.exports = model(COMMENT.ref, commentSchema)
