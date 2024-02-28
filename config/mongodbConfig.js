const app = require('../app.js');
var mongoose = require('mongoose');

const { MONGO_PORT, MONGO_URI } = process.env;

// connecting mongodb
module.exports = function connectMongoDB() {
	mongoose
	.connect(MONGO_URI, {  })
	.then(() => console.log('Successfully connected to mongodb'))
	.catch(e => console.error(e));
	return;
}
