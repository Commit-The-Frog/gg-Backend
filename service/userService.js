const logger = require('../config/logger');
const userRepository = require('../repository/userRepository');

const getOneUserInfo = async (userId) => {
	try {
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
		const userInfo = await userRepository.findUserByName(name);
		return (userInfo);
	} catch (error) {
		throw error;
	}
}

const getUserNamesStartWith = async (str) => {
	try {
		const userNames = await userRepository.findUserNamesByRegex("/^" + str + ".*/");
		return (userNames);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getOneUserInfo,
	getUsersInfo,
	getOneUserInfoByName,
	getUserNamesStartWith
}
