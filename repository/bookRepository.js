const { Book } = require('../config/mongodbConfig');
const { User } = require('../config/mongodbConfig');
const Exception = require('../exception/exception');
const bookException = require('../exception/bookException');
var logger = require('../config/logger');
const { UserNotFoundError } = require('../exception/userException');

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
		logger.info(`### added book to DB : [userId: ${result.user_id}, ${result.start_time}-${result.end_time}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	}
};

// READ book by bookId
const findBookById = async function (bookId) {
	try {
		var result = await Book.findOne({
			_id : new ObjectId(bookId)
		});
		if (result === null)
			throw new bookException.BookNotFoundError('from repository');
		logger.info(`### book searched from DB : [${bookId}, ${book.start_time}-${book.end_time}]`);
		return result;
	} catch (error) {
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception("from repository");
	}
}

// READ books by userId, type, date
const findBooksByUserIdAndTypeAndDate = async function (userId, type, date) {
	try {
		if (!(date instanceof String))
			date = date.toString();
		var result = await Book.find({
			user_id : userId,
			type : type,
			date : date
		});
		if (result === null)
			throw new bookException.BookNotFoundError('from repository');
		logger.info(`### book searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception("from repository");
	}
};

// READ books by userId, date (all type)
const findBooksByUserIdAndDate = async function (userId, date) {
	try {
		if (!(date instanceof String))
			date = date.toString();
		var result = await Book.find({
			user_id : userId,
			date : date
		});
		if (result === null)
			throw new bookException.BookNotFoundError('from repository');
		logger.info(`### book searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception("from repository");
	}
};

// READ books by userId and type
const findBooksByUserId = async function (userId, type) {
	try {
		var result;
		if (type) {
			result = await Book.find({
				user_id : userId,
				type : type
			});
		}
		else {
			result = await Book.find({
				user_id : userId
			});
		}
		logger.info(`### book searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	} 
};

// READ books by date and type
const findBooksAtDate = async function (date, type) {
	try {
		var result;
		if (type) {
			result = await Book.find({
				date : date,
				type : type
			});
		}
		else {
			result = await Book.find({
				date : date
			});
		}
		logger.info(`### book searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception('from repository');
	}
}

// READ books by type and start/end time
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
		logger.info(`### book at time searched from DB : [count : ${result.length}]`);
		return result;
	} catch (error) {
		throw new Exception("from repository");
	}
}

// READ books of user at time
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
		logger.info(`### book of user at time searched from DB : [${start}-${end}]`);
		return result;
	} catch (error) {
		throw new Exception('from repository');
	}
};

// UPDATE book by book id
const updateBookById = async function (userId, bookId, start, end, date, type) {
	try {
		const filter = { _id : new ObjectId(bookId) };
		const update = { 
			start_time : start,
			end_time : end,
			date : date,
			type : type
		};
		var user = await User.findOne({ user_id : userId });
		if (user === null)
			throw new UserNotFoundError('from repository');
		var result = await Book.updateOne(filter, update);
		if (result.modifiedCount == 0)
			throw new bookException.BookNotFoundError('from repository');
		logger.info(`### book of user updated from DB`);
		return await Book.findOne({ _id : new ObjectId(bookId) });
	} catch (error) {
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception('from repository');
	}
};

// DELETE book by book id
const deleteBookById = async function (userId, bookId) {
	try {
		var user = await User.find({ user_id : userId });
		if (user === null)
			throw new UserNotFoundError('from repository');
		var result = await Book.deleteOne({
			_id : new Object(bookId)
		});
		if (result.deletedCount == 0)
			throw new bookException.BookNotFoundError('from repository');
		logger.info(`### book of user deleted from DB`);
	} catch (error) {
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception('from repository');
	}
};

module.exports = {
	createBook,
	findBookById,
	findBooksByUserId,
	findBookAtTime,
	findBooksAtDate,
	findBookOfUserAtTime,
	findBooksByUserIdAndTypeAndDate,
	findBooksByUserIdAndDate,
	updateBookById,
	deleteBookById
};