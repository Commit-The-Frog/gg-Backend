const dotenv = require("dotenv").config();
const bookException = require('../exception/bookException');
const verifyException = require('../exception/verifyException');
const bookRepository = require('../repository/bookRepository');
const userRepository = require('../repository/userRepository');
const verifyService = require('../service/verifyService.js');
const sseService = require('../service/sseService.js');
const logger = require('../config/logger.js');

function getTodayString() {
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	const newDateTime = new Date(utc + 9 * 3600000);
	return `${newDateTime.getFullYear()}-${(newDateTime.getMonth() + 1).toString().padStart(2, '0')}-${newDateTime.getDate().toString().padStart(2, '0')}`;
}

function getCurrentTick() {
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	const newDateTime = new Date(utc + 9 * 3600000);
	return Math.floor((newDateTime.getHours() + newDateTime.getMinutes() / 60) * 2);
}

/**
 * [isValidBook]
 * start, end시간에 대해서
 * 유저가 현재시각을 기준으로 유효한 예약들의 남은 슬롯 개수와
 * 새로 넣는 start end 시각이 차지하는 슬롯의 개수 합이
 * limit_slot보다 크면 안된다.
 */
async function isValidBook(userId, start, end, date) {
	const limit_slot = parseInt(process.env.LIMIT_SLOT);
	const today = getTodayString();
	const curTick = getCurrentTick();
	const userRemainBook = await bookRepository.findBookOfUserAtTime(userId, curTick, 47, today);
	let userRemainBookTick = 0;
	userRemainBook.forEach(function(element) {
		userRemainBookTick += element.end_time - element.start_time + 1;
		// userRemainBookTick += element.end_time - Math.max(element.start_time, curTick) + 1;
		// 위의 코드는 현재 시각을 기준으로 남은 예약 슬롯의 개수를 센다. 계속해서 30분씩 연장가능.
	});
	logger.info(`### User Remain Book Tick = ${userRemainBookTick}`);
	if (date != today || curTick > start)
		throw new bookException.InvalidTimeError('from service');
	if (end - start + 1 > limit_slot || userRemainBookTick + (end - start + 1) > limit_slot)
		throw new bookException.BookNotEnoughRemainSlot('from service');
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
			throw new bookException.BookTimeConflictError('from service');
		let bookList = await bookRepository.findBookAtTime(
			type,start,end,date
		);
		if (bookList.length > 0)
			throw new bookException.BookTimeConflictError('from service');
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
		bookList.sort((a, b) => a.start_time - b.start_time);
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
		const currentTick = getCurrentTick();
		if (targetBook[0].end_time < currentTick)
			throw new bookException.InvalidTimeError('From Service');
		await bookRepository.deleteBookById(userId, bookId);
		sseService.sendInfoToListeners("DEL", {"_id": bookId, "type": targetBook[0].type});
		if (targetBook[0].start_time < currentTick) {
			const result = await bookRepository.createBook(targetBook[0].user_id, targetBook[0].start_time,
				currentTick - 1, targetBook[0].date, targetBook[0].type);
			sseService.sendInfoToListeners('ADD', result[0]);
		}
	} catch (error) {
		throw error;
	}
};

/*	[userCurrentPlaying]
	유저 id로 해당 유저가 현재 시각에 해당하는 예약이 있는지 확인한다. */
const userCurrentPlaying = async (userId) => {
	try {
		const curTick = getCurrentTick();
		const today = getTodayString();
		const userRemainBook = await bookRepository.findBookOfUserAtTime(userId, curTick, curTick, today);
		if (userRemainBook[0])
			return true;
		return false;
	} catch (error) {
		throw error;
	}
}


module.exports = {
	addBook,
	findBookListOfUser,
	findBookListOfDate,
	findBookListOfUserByTypeAndDate,
	updateBookById,
	findBookById,
	deleteBookById,
	userCurrentPlaying
};
