require('dotenv').config();
const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const access_secret = process.env.ADMIN_ACCESS_SECRET;
const refresh_secret = process.env.ADMIN_REFRESH_SECRET;
const jwtException = require('../exception/jwtException.js');
var logger = require('../config/logger');
var verifyService = require('../service/verifyService.js');

const isAdminUser = function (id) {
	const idArray = process.env.ADMIN_USER_ID_LIST.split(':');
	if (idArray.includes(id))
	{
		logger.info("### User Is Admin");
		return true;
	}
	else
		return false;
}


/*	[accessTokenSign]
	access token의 payload에 user id 입력
	access token 발급
	실패시 TokenSignError
*/
const accessTokenSign = (userId) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		const payload = {
			id: userId,
			admin: adminService.isAdminUser(userId)
		}
		const accessToken = jwt.sign(
			payload,
			access_secret, {
			algorithm: 'HS256',
			expiresIn: '1h'
		});
		logger.info("### Admin Access Token Signed");
		return (accessToken);
	} catch(error) {
		throw new jwtException.TokenSignError("from service")
	}
};

/*	[accessTokenSign]
	access token verify 시도.
	access token payload의 user id와 query의 userId 비교
	실패시 TokenAuthorizeError
*/
const accessTokenVerify = (userId, accessToken) => {
	try {
		accessToken = tokenParse(accessToken);
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		if (!verifyService.isValidTokenStruct(accessToken))
			throw Error();
		const decoded = jwt.verify(accessToken, access_secret);
		logger.info("### Admin Access Token Verified");
		if (decoded.id != userId) {
			throw new Error();
		}
		logger.info("### Admin Access Token ID Verified");
		return (true);
	} catch (error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
};

/*	[refreshTokenSign]
	refresh token의 payload에 user id 입력
	새로은 refresh token 발급 2주 이후에는 자동 삭제
	실패시 TokenSignError
*/
const refreshTokenSign = async (userId) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		const data = jwt.sign({
			id: userId
		}, refresh_secret, {
			algorithm: 'HS256',
			expiresIn: '14d',
		})
		const redisClient = await createRedisClient();
		const tokenScore = Date.now() / 1000;
		await redisClient.sendCommand(['ZADD', userId, tokenScore.toString(), data]); // userId set에 새로운 RT 추가
		logger.info("### Admin Refresh Token Saved In Redis");
		const tokenLength = await redisClient.sendCommand(['ZCARD', userId]);
		if (tokenLength > 5)
		{
			await redisClient.sendCommand(['ZREMRANGEBYRANK', userId, '0', '0']);
			logger.info("### Admin Oldest Refresh Token Deleted");
		}
		redisClient.quit();
		return (data);
	} catch (error) {
		throw new jwtException.TokenSignError("from service");
	}
}

/*
	[refreshTokenVerify]
	request RT가 Verify되는지 확인
	request RT의 payload에 저장된 user id가 query의 user id와 같은지 확인
	request RT가 userId의 set에 있는지 확인
	확인 후에 RT 삭제
	실패시 TokenAuthorizeError
	성공시 true 리턴
*/
const refreshTokenVerify = async (refreshToken, userId) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		refreshToken = tokenParse(refreshToken);
		if (!verifyService.isValidTokenStruct(refreshToken))
			throw Error();
		const decoded = jwt.verify(refreshToken, refresh_secret);
		logger.info("### Admin Request RT verified");
		if (decoded.id != userId)
			throw Error();
		const redisClient = await createRedisClient();
		if (await redisClient.sendCommand(['ZSCORE', userId, refreshToken])) { // RT가 있는지 확인
			logger.info("### Admin Requset RT is not used before");
		} else {
			await redisClient.sendCommand(['DEL', userId]);
			logger.info('### Admin ' + userId + "'s all RT are deleted from redis because of security issue");
			throw Error();
		}
		await redisClient.sendCommand(['ZREM', userId, refreshToken]); // 사용된 RT set에서 삭제
		logger.info("### Admin Make Request RT Expire");
		redisClient.quit();
	} catch (error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
}

/*	[refreshTokenDelete]
	query로 받은 userId에 해당하는 RT를 redis에서 제거한다.
*/
const refreshTokenDelete = async (userId, refreshToken) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		refreshToken = tokenParse(refreshToken);
		if (!verifyService.isValidTokenStruct(refreshToken))
			throw Error();
		const redisClient = await createRedisClient();
		await redisClient.sendCommand(['ZREM', userId, refreshToken]);
		redisClient.quit();
		logger.info("### Admin " + userId + "'s RT Deleted From Redis");
	} catch (error) {
		throw new jwtException.LogoutError("from service");
	}
}

module.exports = {
	isAdminUser,
	accessTokenSign,
	accessTokenVerify,
	refreshTokenSign,
	refreshTokenVerify,
	refreshTokenDelete
}
