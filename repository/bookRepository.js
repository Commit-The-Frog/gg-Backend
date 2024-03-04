const { Book } = require('../config/mongodbConfig');
const Exception = require('../exception/exception');

// CREATE book
const createBook = async function (userId, start, end, date, type) {
	try {
		var result = await Book.create({
			user_id : userId,
			start_time : start,
			end_time : end,
			date : date,
			type : type
		});
		console.log(`### added book to DB : [userId:${result.user_id}, ${result.start_time}-${result.end_time}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	}
};

// READ book by userId
const readBooksByUserId = async function (userId) {
	try {
		var result = await Book.find({
			user_id : userId
		});
		console.log(`### book searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	} 
};

// READ book by type and start/end time
const readBookOfTime = async function (type, start, end, date) {
	try {
		var result = await Book.find({
			$and : [
				{ type: type },
				{ start_time : { $lt : end } },
				{ end_time : { $gt : start }},
				{ date : date }
			]
		});
		console.log(`### book of time searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	}
}

module.exports = {
	createBook,
	readBooksByUserId,
	readBookOfTime
};