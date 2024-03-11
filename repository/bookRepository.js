const { Book } = require('../config/mongodbConfig');
const { User } = require('../config/mongodbConfig');
const Exception = require('../exception/exception');
const bookException = require('../exception/bookException');
var logger = require('../config/logger');
const { UserNotFoundError } = require('../exception/userException');
const {ObjectId} = require('mongodb');

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
		return await findBookById(result._id.toHexString());
	} catch (error) {
		throw new Exception("from repository");
	}
};

// READ book by bookId
const findBookById = async function (bookId) {
	try {
		bookId = ObjectId.createFromHexString(bookId);
		var result = await Book.aggregate([
			{
				$match:
				{
					_id : bookId
				}
			},
			{
				$lookup: 
				{
					from : "users",
					localField: "user_id",
					foreignField: "user_id",
					as: "user"
				}
			}
		]);
		logger.info(`### book searched from DB [count : ${result.length}]`);
		return result;
	} catch (error) {
		console.log(error);
		if (error instanceof Exception)
			throw error;
		else
			throw new Exception("from repository");
	}
}

// READ books by userId, type, date
const findBooksByUserIdAndTypeAndDate = async function (userId, type, date) {
	try {
		type = parseInt(type);
		var result = await Book.aggregate([
			{
				$match:
				{
					user_id: userId,
					type: type,
					date: date
				}
			},
			{
				$lookup: 
				{
					from : "users",
					localField: "user_id",
					foreignField: "user_id",
					as: "user"
				}
			}
		]);
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
		result = await Book.aggregate([
			{
				$match:
				{
					user_id: userId,
					date: date
				}
			},
			{
				$lookup: 
				{
					from : "users",
					localField: "user_id",
					foreignField: "user_id",
					as: "user"
				}
			}
		]);
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
			result = await Book.aggregate([
				{
					$match:
					{
						user_id: userId,
						type: parseInt(type)
					}
				},
				{
					$lookup: 
					{
						from : "users",
						localField: "user_id",
						foreignField: "user_id",
						as: "user"
					}
				}
			]);
		}
		else {
			result = await Book.aggregate([
				{
					$match:
					{
						user_id: userId
					}
				},
				{
					$lookup: 
					{
						from : "users",
						localField: "user_id",
						foreignField: "user_id",
						as: "user"
					}
				}
			]);
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
		type = parseInt(type);
		if (type) {
			result = await Book.aggregate([
				{
					$match:
					{
						date: date,
						type: type
					}
				},
				{
					$lookup: 
					{
						from : "users",
						localField: "user_id",
						foreignField: "user_id",
						as: "user"
					}
				}
			]);
		} else {
			result = await Book.aggregate([
				{
					$match:
					{
						date: date
					}
				},
				{
					$lookup: 
					{
						from : "users",
						localField: "user_id",
						foreignField: "user_id",
						as: "user"
					}
				}
			]);
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
		const filter = { _id : ObjectId.createFromHexString(bookId) };
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
		return await findBookById(bookId);
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
		bookId = ObjectId.createFromHexString(bookId);
		var user = await User.findOne({ user_id : userId });
		if (user === null)
			throw new UserNotFoundError('from repository');
		var result = await Book.deleteOne({
			_id : bookId,
			user_id: userId
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