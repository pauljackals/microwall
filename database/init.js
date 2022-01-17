database = _getEnv("MONGO_DATABASE")

db = db.getSiblingDB(database);
db.createUser(
    {
        user: _getEnv("MONGO_USERNAME"),
        pwd: _getEnv("MONGO_PASSWORD"),
        roles: [
            {
                role: "readWrite",
                db: database
            }
        ]
    }
);
