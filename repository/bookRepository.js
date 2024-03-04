const { Book } = require('../config/mongodbConfig');
const Exception = require('../exception/exception');
const bookException = require('../exception/bookException');

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

// READ book by bookId
const findBookById = async function (bookId) {
	try {
		var result = await Book.find({
			_id : bookId
		});
		console.log(`### book searched from DB : [${bookId}, ${book.start_time}-${book.end_time}]`);
	} catch (error) {
		throw new bookException.BookNotFoundError("from repository");
	}
}

// READ book by userId
const findBooksByUserId = async function (userId) {
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
const findBookAtTime = async function (type, start, end, date) {
	try {
		var result = await Book.find({
			$and : [
				{ type: type },
				{ start_time : { $lt : end } },
				{ end_time : { $gt : start }},
				{ date : date }
			]
		});
		console.log(`### book at time searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	}
}

// READ book of user at time
const findBookOfUserAtTime = async function (userId, start, end, date) {
	try {
		var result = await Book.find({
			$and : [
				{ user_id : userId },
				{ start_time : { $lt : end } },
				{ end_time : { $gt : start }},
				{ date : date }
			]
		});
		console.log(`### book of user at time searched from DB : [${start}-${end}]`);
		return result;
	} catch (error) {
		throw new Exception('from repository');
	}
}

module.exports = {
	createBook,
	findBookById,
	findBooksByUserId,
	findBookAtTime,
	findBookOfUserAtTime
};