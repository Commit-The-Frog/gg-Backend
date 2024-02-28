const app = require('../app.js');
var mongoose = require('mongoose');

const { MONGO_PORT, MONGO_URI } = process.env;

// connecting mongodb
const connectMongoDB = function () {
	mongoose
	.connect(MONGO_URI, {  })
	.then(() => console.log('Successfully connected to mongodb'))
	.catch(e => console.error(e));
	return;
}

// Define Schemas
const userSchema = new mongoose.Schema({
	user_id : { type : String, required: true, unique : true },
	name : { type : String, required: true, unique : true },
	profile_img : { type : String, required: false }
},
{
	timestamps: true
});

// Create Model
const User = mongoose.model('user', userSchema);

module.exports = {
	connectMongoDB,
	User
};
