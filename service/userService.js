const logger = require('../config/logger');
const userRepository = require('../repository/userRepository');
const verifyService = require('../service/verifyService');
const verifyException = require('../exception/verifyException');

const getOneUserInfo = async (userId) => {
	try {
		if (!verifyService.isValidId(userId))
			throw new verifyException.inputFormatError('in service');
		const userInfo = await userRepository.findUserById(userId);
		return (userInfo);
	} catch (error) {
		throw error;
	}
}

const getUsersInfo = async () => {
	try {
		const usersInfo = await userRepository.findAllUsers();
		return (usersInfo);
	} catch (error) {
		throw error;
	}
}

const getOneUserInfoByName = async (name) => {
	try {
		if (!verifyService.isValidName(name))
			throw new verifyException.inputFormatError('in service');
		const userInfo = await userRepository.findUserByName(name);
		return (userInfo);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getOneUserInfo,
	getUsersInfo,
	getOneUserInfoByName
}
