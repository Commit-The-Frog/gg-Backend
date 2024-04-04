const dotenv = require("dotenv").config();
const bookException = require('../exception/bookException');
const verifyException = require('../exception/verifyException');
const bookRepository = require('../repository/bookRepository');
const userRepository = require('../repository/userRepository');
const verifyService = require('../service/verifyService.js');
const sseService = require('../service/sseService.js');
const logger = require('../config/logger.js');

/**
 * [isValidBook]
 * start, end시간에 대해서
 * 유저가 현재 시각부터 남은 슬롯의 개수와
 * 새로 넣는 start end 시각이 차지하는 슬롯의 개수 합이
 *
 */
async function isValidBook(userId, start, end, date) {
	const limit_slot = parseInt(process.env.LIMIT_SLOT);
	let now = new Date();
	let utc = now.getTime() + now.getTimezoneOffset() * 60000;
	let newDateTime = new Date(utc + 9 * 3600000);
	let today = `${newDateTime.getFullYear()}-${(newDateTime.getMonth() + 1).toString().padStart(2, '0')}-${newDateTime.getDate().toString().padStart(2, '0')}`;
	let curTick = Math.floor((newDateTime.getHours() + newDateTime.getMinutes() / 60) * 2);
	let userRemainBook = await bookRepository.findBookOfUserAtTime(userId, curTick, 47, today);
	let userRemainBookTick = 0;
	userRemainBook.forEach(function(element) {
		userRemainBookTick += element.end_time - Math.max(element.start_time, curTick) + 1;
	});
	logger.info(`### User Remain Book Tick = ${userRemainBookTick}`);
	if (date != today || curTick > start || end - start + 1 > limit_slot || userRemainBookTick + (end - start + 1) > limit_slot)
		throw new bookException.InvalidTimeError('from service');
}

/*	[addBook]
	해당 기기가 유효한지 검사
	예약 시간이 유효한지 검사
	유저 id로 유저 검색 (존재하는 유저인지 검사)
	해당 시간대에 해당 유저가 예약중인지 존재하는지 검사
	해당 시간대에 같은 기기가 예약중인지 검사
	=> 예약 추가 */
const addBook = async function (userId, start, end, date, type) {
	try {
		await verifyBook(userId, start, end, date, type);
		let result = await bookRepository.createBook(
			userId, start, end, date, type
		);
		sseService.sendInfoToListeners('ADD', result[0]);
		return result;
	} catch (error) {
		throw error;
	}
};

/*	[verifyBook]
	=> 유효한 예약인지 검사 */
const verifyBook = async function (userId, start, end, date, type) {
	try {
		if (!verifyService.isValidDate(date) || !verifyService.isValidId(userId)
			|| !verifyService.isValidNumber(start) || !verifyService.isValidNumber(end)
			|| (type && !verifyService.isValidNumber(type)))
			throw new verifyException.inputFormatError('from service');
		if (type < 1 || type > 3)
			throw new bookException.InvalidTypeError('from service');
		if (start > end || start > 144 || start < 0 || end > 144 || end < 0)
			throw new bookException.InvalidTimeError('from service');
		await isValidBook(userId, start, end, date);
		await userRepository.findUserById(userId);
		let bookOfUserAtTime = await bookRepository.findBookOfUserAtTime(userId, start, end, date);
		if (bookOfUserAtTime.length > 0)
			throw new bookException.BookTimeConfilctError('from service');
		let bookList = await bookRepository.findBookAtTime(
			type,start,end,date
		);
		if (bookList.length > 0)
			throw new bookException.BookTimeConfilctError('from service');
	} catch (error) {
		throw error;
	}
}

/*	[findBookById]
	=> 예약 id로 단일 예약 정보 조회 */
const findBookById = async function (bookId) {
	try {
		let book = await bookRepository.findBookById(bookId);
		if (book === null)
			throw new bookException.BookNotFoundError("from service");
		return book;
	} catch (error) {
		throw error;
	}
};

/*	[findBookListOfDate]
	=> 특정 날짜의 특정 타입으로 모든 예약 목록 조회 */
const findBookListOfDate = async function (date, type) {
	try {
		if (!verifyService.isValidDate(date) || (type && !verifyService.isValidNumber(type)))
			throw new verifyException.inputFormatError('from service');
		let bookList = await bookRepository.findBooksAtDate(date, type);
		return bookList;
	} catch (error) {
		throw error;
	}
};

/*	[findBookListOfUserByTypeAndDate]
	유저 id로 존재하는 유저인지 검사
	=> 유저의 예약 목록 조회 (특정 날짜의 특정 타입) */
const findBookListOfUserByTypeAndDate = async function (userId, type, date) {
	try {
		if (!verifyService.isValidDate(date) || !verifyService.isValidId(userId)
			|| (type && !verifyService.isValidNumber(type)))
			throw new verifyException.inputFormatError('from service');
		await userRepository.findUserById(userId);
		let bookList;
		if (type) {
			bookList = await bookRepository.findBooksByUserIdAndTypeAndDate(userId, type, date);
		}
		else {
			bookList = await bookRepository.findBooksByUserIdAndDate(userId, date);
		}
		return bookList;
	} catch (error) {
		throw error;
	}
};

/*	[findBookListOfUser]
	유저 id로 해당 유저가 존재하는지 검사
	=> 해당 유저의 특정 타입으로 모든 예약 목록 조회 */
const findBookListOfUser = async function (userId, type) {
	try {
		if (!verifyService.isValidId(userId) || (type && !verifyService.isValidNumber(type)))
			throw new verifyException.inputFormatError('from service');
		await userRepository.findUserById(userId);
		let bookList = await bookRepository.findBooksByUserId(userId, type);
		return bookList;
	} catch (error) {
		throw error;
	}
};

/*	[updateBook]
	유저 id로 해당 유저가 존재하는지 검사
	=> 해당 유저의 해당 예약 id로 예약 정보 수정 */
const updateBookById = async function (userId, bookId, start, end, date, type) {
	try {
		if (!verifyService.isValidDate(date) || !verifyService.isValidId(userId)
		|| !verifyService.isValidNumber(start) || !verifyService.isValidNumber(end)
		|| (type && !verifyService.isValidNumber(type)))
			throw new verifyException.inputFormatError('from service');
		await verifyBook(userId, start, end, date, type);
		return await bookRepository.updateBookById(userId, bookId, start, end, date, type);
	} catch (error) {
		throw error;
	}
};

/*	[deleteBook]
	유저 id로 해당 유저가 존재하는지 검사
	=> 해당 유저의 해당 예약 id로 예약 정보 삭제 */
const deleteBookById = async function (userId, bookId) {
	try {
		if (!verifyService.isValidId(userId))
			throw new verifyException.inputFormatError('from service');
		const targetBook = await bookRepository.findBookById(bookId);
		await bookRepository.deleteBookById(userId, bookId);
		sseService.sendInfoToListeners("DEL", {"_id": bookId, "type": targetBook[0].type});
	} catch (error) {
		throw error;
	}
};


module.exports = {
	addBook,
	findBookListOfUser,
	findBookListOfDate,
	findBookListOfUserByTypeAndDate,
	updateBookById,
	findBookById,
	deleteBookById
};
