var express = require('express');
var router = express.Router();
var bookService = require('../service/bookService');

/* GET book list of user */
router.get('/', async function(req, res, next) {
	try {
		var book = await bookRepository.findBooksByUserId(
			req.query.userId
		);
		res.status(200).send(book);
	}
	catch (error) {
		res.status(error.status).send(error.name);
	}
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
		res.status(200).send(`successfully added book [${book._id}, ${book.start_time}-${book.end_time}]`);
	} catch (error) {
		res.status(error.status).send(error.name);
	}
});

module.exports = router;