const { Book } = require('../config/mongodbConfig');

// CREATE book
const addBook = async function (userId, start, end, date) {
	var result = await Book.create({
		user_id : userId,
		start_time : start,
		end_time : end,
		date : date
	});
	console.log(`### added book to DB : [userId:${result.user_id}, ${result.start_time}-${result.end_time}]`);
	return result;
};

// FIND book by userId
const findBookByUserId = async function (userId) {
	var result = await Book.find({
		user_id : userId
	});
	console.log(`### book searched from DB : [userId:${result.user_id}, ${result.start_time}-${result.end_time}]`);
	return result;
};

module.exports = {
	addBook,
	findBookByUserId
};