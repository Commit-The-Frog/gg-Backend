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

// Define Schema : user
const userSchema = new mongoose.Schema({
	user_id : { type : String, required: true, unique : true },
	name : { type : String, required: true, unique : true },
	profile_img : { type : String, required: false }
},
{
	timestamps: true
});

// Define Scehma : book
const bookSchema = new mongoose.Schema({
	user_id : { type : String, required: true },
	start_time : { type : Number, required: true },
	end_time : { type : Number, required : true },
	date : { type : String, required : true },
	type : { type : Number, required : true }
},
{
	timestamps: true
});

// Create Models
const User = mongoose.model('user', userSchema);
const Book = mongoose.model('book', bookSchema);

module.exports = {
	connectMongoDB,
	User,
	Book
};
