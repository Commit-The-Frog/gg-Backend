const bookException = require('../exception/bookException');
const bookRepository = require('../repository/bookRepository');
const userRepository = require('../repository/userRepository');

/* [addBook] */
const addBook = async function (userId, start, end, date, type) {
	if (start >= end)
		throw new bookException.BookTimeFormatError('from bookService');
	await userRepository.findUserById(userId);
	var bookList = await bookRepository.readBookOfTime(
		type,start,end,date
	);
	if (bookList.length > 0)
		throw new bookException.BookTimeConfilctError('from bookService');
	var result = await bookRepository.createBook(
		userId, start, end, date, type
	);
	return result;
};

module.exports = {
	addBook
};