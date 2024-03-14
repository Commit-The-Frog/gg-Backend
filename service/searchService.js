const logger = require('../config/logger');
const userRepository = require('../repository/userRepository');
const createRedisClient = require('./redisService.js');
var userException = require('../exception/userException');

const findUserNameByPattern = async function (pattern) {
	try {
		const redisClient = await createRedisClient();
		const userExists = await redisClient.sendCommand(['EXISTS', 'users']);
		if (!userExists)
			throw Error();
		const userNames = await redisClient.sendCommand(['ZSCAN', 'users', '0', 'MATCH', pattern, 'COUNT', '5']);
		logger.info(userNames);
		return userNames;
	} catch (error) {
		throw new userException.UserNotFoundError('from service');
	}
}

module.exports = {
	findUserNameByPattern
};
