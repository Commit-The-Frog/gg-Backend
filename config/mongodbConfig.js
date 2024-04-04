const app = require('../app.js');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const { MONGO_PORT, MONGO_URI, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, MONGO_AUTH_SOURCE } = process.env;

// connecting mongodb
const connectMongoDB = function () {
    mongoose
    .connect(MONGO_URI, {
        auth: {
            username: MONGO_INITDB_ROOT_USERNAME, // 사용자 이름
            password: MONGO_INITDB_ROOT_PASSWORD // 암호
        },
		authSource: MONGO_AUTH_SOURCE
    })
	.then(() => logger.info('Successfully connected to mongodb'))
	.catch(e => logger.info(e));
	return;
}

// Define Schema : user
const userSchema = new mongoose.Schema({
	user_id : { type : String, required: true, unique : true },
	name : { type : String, required: true, unique : true },
	displayname : { type : String, required: false },
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
