const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const { JWT_ACCESS_SECRET, ADMIN_ACCESS_SECRET, JWT_REFRESH_SECRET, ADMIN_REFRESH_SECRET } = process.env;
const jwtException = require('../exception/jwtException.js');
const logger = require('../config/logger');
const verifyService = require('../service/verifyService.js');
const adminService = require('../service/adminService.js');

const tokenParse = (rawToken) => {
	try {
		if (rawToken.split(' ')[0] != "Bearer")
			throw Error();
		return rawToken.split(' ')[1];
	} catch(error) {
		throw new jwtException.TokenAuthorizeError("from service")
	}
}

/*	[accessTokenSign]
	access token의 payload에 user id, admin 여부 입력
	access token 발급
	실패시 TokenSignError
*/
const accessTokenSign = (userId, admin) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		const payload = {
			id : userId,
			role : admin ? 'admin' : 'client'
		}
		const access_secret = admin ? ADMIN_ACCESS_SECRET : JWT_ACCESS_SECRET;
		const accessToken = jwt.sign(
			payload,
			access_secret, {
			algorithm: 'HS256',
			expiresIn: '1h'
		});
		logger.info("### Access Token Signed");
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
		const isAdmin = adminService.isAdminUserToken(accessToken);
		const access_secret = isAdmin ? ADMIN_ACCESS_SECRET : JWT_ACCESS_SECRET;
		logger.info(`### Access Token Payload : ${isAdmin}`);
		const decoded = jwt.verify(accessToken, access_secret);
		logger.info(`### Access Token Verified ADMIN : ${isAdmin}`);
		if (!isAdmin && decoded.id != userId) {
			throw new Error();
		} else {
			logger.info("### Access Token ID Verified");
		}
		return (true);
	} catch (error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
};

/*	[refreshTokenSign]
	refresh token의 payload에 user id, admin 여부 입력
	새로은 refresh token 발급 2주 이후에는 자동 삭제
	실패시 TokenSignError
*/
const refreshTokenSign = async (userId, admin) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		const payload = {
			id : userId,
			role : admin ? 'admin' : 'client'
		}
		const refresh_secret = admin ? ADMIN_REFRESH_SECRET : JWT_REFRESH_SECRET;
		const data = jwt.sign(
			payload,
			refresh_secret, {
			algorithm: 'HS256',
			expiresIn: '14d',
		})
		const redisClient = await createRedisClient();
		const tokenScore = Date.now();
		await redisClient.sendCommand(['ZADD', userId, tokenScore.toString(), data]); // userId set에 새로운 RT 추가
		logger.info("### Refresh Token Saved In Redis");
		const tokenLength = await redisClient.sendCommand(['ZCARD', userId]);
		if (tokenLength > 5)
		{
			await redisClient.sendCommand(['ZREMRANGEBYRANK', userId, '0', '0']);
			logger.info("### Oldest Refresh Token Deleted");
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
		const isAdmin = adminService.isAdminUserToken(refreshToken);
		const refresh_secret = isAdmin ? ADMIN_REFRESH_SECRET : JWT_REFRESH_SECRET;
		const decoded = jwt.verify(refreshToken, refresh_secret);
		logger.info(`### Request RT verified ADMIN : ${isAdmin}`);
		if (!isAdmin && decoded.id != userId) {
			throw Error();
		} else {
			logger.info("### Refresh Token ID Verified");
		}
		const redisClient = await createRedisClient();
		if (await redisClient.sendCommand(['ZSCORE', userId, refreshToken])) { // RT가 있는지 확인
			logger.info("### Requset RT is not used before");
		} else {
			await redisClient.sendCommand(['DEL', userId]);
			logger.info('### ' + userId + "'s all RT are deleted from redis because of security issue");
			throw Error();
		}
		await redisClient.sendCommand(['ZREM', userId, refreshToken]); // 사용된 RT set에서 삭제
		logger.info("### Make Request RT Expire");
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
		logger.info("### " + userId + "'s RT Deleted From Redis");
	} catch (error) {
		throw new jwtException.LogoutError("from service");
	}
}

module.exports = {
	tokenParse,
	accessTokenSign,
	accessTokenVerify,
	refreshTokenSign,
	refreshTokenVerify,
	refreshTokenDelete
}
