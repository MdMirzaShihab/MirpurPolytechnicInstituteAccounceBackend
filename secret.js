require('dotenv').config();

const serverPort = process.env.PORT || 3000;
const MongodbURL = process.env.MONGO_URI;

module.exports = { serverPort, MongodbURL };