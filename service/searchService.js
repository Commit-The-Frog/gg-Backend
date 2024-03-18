const logger = require('../config/logger');
const userRepository = require('../repository/userRepository');
const createRedisClient = require('./redisService.js');
var userException = require('../exception/userException');


function isValidString(str) {
	const pattern = /^[a-zA-Z]+$/;
	return pattern.test(str);
}

const findUserNameByPatternInRedis = async function (pattern) {
	try {
		const redisClient = await createRedisClient();
		const userExists = await redisClient.sendCommand(['EXISTS', 'users']);
		if (!userExists)
			throw Error();
		const nameArray = [];
		if (!isValidString(pattern))
		{
			logger.info("### Invalide Pattern Found In User Find")
			return nameArray;
		}
		if (pattern.length < 2)
			return nameArray;
		pattern = pattern + '*';
		const userNames = await redisClient.sendCommand(['ZSCAN', 'users', pattern.charCodeAt(0).toString(), 'MATCH', pattern, 'COUNT', '5']);
		logger.info("### User Searched Match With Pattern");
		for (let i = 0; i < userNames[1].length; i += 2){
			nameArray.push(userNames[1][i]);
		}
		return nameArray;
	} catch (error) {
		logger.info("###" + error);
		throw new userException.UserNotFoundError('from service');
	}
}

const addUserNameInRedis = async function (name) {
	try {
		const redisClient = await createRedisClient();
		await redisClient.sendCommand(['ZADD', 'users', name.charCodeAt(0).toString(), name]);
		logger.info("### User Name Added In Redis Pattern");
	} catch (error) {
		throw error;
	}
}

module.exports = {
	findUserNameByPatternInRedis,
	addUserNameInRedis
};
