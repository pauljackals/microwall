const mongoose = require("./mongo")
const MongoStore = require("connect-mongo")

module.exports = MongoStore.create({
    client: mongoose.connection.client
})
