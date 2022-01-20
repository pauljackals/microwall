const mongoose = require("mongoose")

const username = process.env.MONGO_USERNAME
const password = encodeURIComponent(process.env.MONGO_PASSWORD)
const port = process.env.MONGO_PORT || 27017
const database = process.env.MONGO_DATABASE || "db"

mongoose.connect(`mongodb://${username}:${password}@localhost:${port}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")
})
mongoose.connection.on("error", error => {
    console.error("Error on MongoDB connection\n", error)
})
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB")
})

module.exports = mongoose
