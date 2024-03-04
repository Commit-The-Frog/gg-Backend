var express = require('express');
var router = express.Router();
var bookService = require('../service/bookService');
const userException = require('../exception/userException');
const bookException = require('../exception/bookException');

/* GET book list of user */
router.get('/', async function(req, res, next) {
	var book = await bookRepository.findBooksByUserId(
		req.query.userId
	);
	res.status(200).send(book);
});

/* POST new book of user */
router.post('/', async function(req, res, next) {
	try {
		var book = await bookService.addBook(
			req.body.userId,
			req.body.start,
			req.body.end,
			req.body.date,
			req.body.type
		);
		res.status(200).send(`successfully added book 
		[${book.start_time}-${book.end_time}]`);
	} catch (error) {
		if (error instanceof userException.UserNotFoundError)
			res.status(404).send("user not found");
		else if (error instanceof bookException.BookTimeConfilctError)
			res.status(400).send("book time conflict");
		else
			res.status(400).send('unknown error');
	}
});

module.exports = router;