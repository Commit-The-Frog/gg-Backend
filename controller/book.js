var express = require('express');
var router = express.Router();
var bookService = require('../service/bookService');

/*	GET
	/books/:userId/list?type&date : 해당 유저의 특정 타입, 특정 날짜의 예약 리스트 응답 */
router.get('/:userId/list', async function(req, res, next) {
	try {
		var bookList = await bookService.findBookListOfUserByTypeAndDate(
			req.params.userId,
			req.query.type,
			req.query.date
		);
		res.status(200).send(bookList);
	}
	catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
});

/* 	GET
	/books/:userId/history : 해당 유저의 모든 예약기록 응답 */
router.get('/:userId/history', async function(req, res, next) {
	try {
		var bookList = await bookService.findBookListOfUser(
			req.params.userId
		);
		res.status(200).send(bookList);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
});

/*	GET
	/books?date : 해당 날짜의 모든 예약 목록 응답 */
router.get('/', async function(req, res, next) {
	try {
		var bookList = await bookService.findBookListOfDate(
			req.query.date
		);
		res.status(200).send(bookList);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

/* 	GET
	/books/:bookId : 단일 예약 정보 응답 */
router.get('/:bookId', async function (req, res, next) {
	try {
		var bookList = await bookService.findBookById(
			req.params.bookId
		);
		res.status(200).send(bookList);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

/*	POST 
	/books?userId&start&end&date&type : 예약 등록 */
router.post('/', async function(req, res, next) {
	try {
		var book = await bookService.addBook(
			req.query.userId,
			req.body.start,
			req.body.end,
			req.body.date,
			req.body.type
		);
		res.status(200).send(`successfully added book [${book._id}, ${book.start_time}-${book.end_time}]`);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
});

module.exports = router;