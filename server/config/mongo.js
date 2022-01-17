const mongoose = require("mongoose")

const username = process.env.MONGO_USERNAME
const password = encodeURIComponent(process.env.MONGO_PASSWORD)
const port = process.env.MONGO_PORT || 27017
const database = process.env.MONGO_DATABASE || "db"

mongoose.connect(`mongodb://${username}:${password}@localhost:${port}/${database}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => {
    console.log("Connected to MongoDB")

}).catch(error => {
    console.error("Can't connect to MongoDB\n", error)
})

module.exports = mongoose
