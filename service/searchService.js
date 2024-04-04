const logger = require('../config/logger');
const userRepository = require('../repository/userRepository');
const createRedisClient = require('./redisService.js');
const userException = require('../exception/userException');
const verifyService = require('../service/verifyService.js');

/*
[findUserNameByPatternInRedis]
매개변수로 받은 패턴을 기준으로 users에서 5개의 일치하는 검색 결과를 내보내준다.
*/
const findUserNameByPatternInRedis = async function (pattern) {
	try {
		const redisClient = await createRedisClient();
		const userExists = await redisClient.sendCommand(['EXISTS', 'users']);
		if (!userExists)
			throw Error();
		const nameArray = [];
		if (!verifyService.isValidName(pattern))
		{
			logger.info("### Invalide Pattern Found In User Find")
			return nameArray;
		}
		if (pattern.length < 2)
			return nameArray;
		pattern = pattern + '*';
		const userNames = await redisClient.sendCommand(['ZSCAN', 'users', pattern.charCodeAt(0).toString(), 'MATCH', pattern]);
		logger.info("### User Searched Match With Pattern");
		for (let i = 0; i < Math.min(userNames[1].length, 10); i += 2){
			nameArray.push(userNames[1][i]);
		}
		return nameArray;
	} catch (error) {
		logger.info("###" + error);
		throw new userException.UserNotFoundError('from service');
	}
}

const addUserNameInRedis = async function (name, id) {
	try {
		const redisClient = await createRedisClient();
		await redisClient.sendCommand(['ZADD', 'users', name.charCodeAt(0).toString(), name + ':' + id]);
		logger.info("### User Name Added In Redis Pattern");
	} catch (error) {
		throw error;
	}
}

module.exports = {
	findUserNameByPatternInRedis,
	addUserNameInRedis
};
