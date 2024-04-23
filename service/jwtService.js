const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const { JWT_ACCESS_SECRET, ADMIN_ACCESS_SECRET, JWT_REFRESH_SECRET, ADMIN_REFRESH_SECRET } = process.env;
const jwtException = require('../exception/jwtException.js');
const logger = require('../config/logger');
const verifyService = require('../service/verifyService.js');
const adminService = require('../service/adminService.js');
const crypto = require('crypto');

const tokenParse = (rawToken) => {
	try {
		if (rawToken.split(' ')[0] != "Bearer")
			throw Error();
		return rawToken.split(' ')[1];
	} catch(error) {
		throw new jwtException.TokenAuthorizeError("from service")
	}
}

const tokenHashCreater = (id) => { // salt 값 넣기 추가
	const hash = crypto.createHash('sha256');
	hash.update(id + Date.now());
	const base64 = hash.digest('base64');
	return base64;
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
	} catch (error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
};

/*	[refreshTokenSign]
	refresh token의 payload에 user id, admin 여부 입력
	새로은 refresh token 발급 2주 이후에는 자동 삭제
	실패시 TokenSignError
*/
const refreshTokenSign = async (userId, admin, hash) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		if (admin) // admin은 refresh token을 만들지 않는다.
			throw Error();
		const userTokenId = hash ? hash : tokenHashCreater(userId);
		const payload = {
			id : userId,
			role : admin ? 'admin' : 'client',
			userTokenId : userTokenId
		}
		const refresh_secret = admin ? ADMIN_REFRESH_SECRET : JWT_REFRESH_SECRET;
		const data = jwt.sign(
			payload,
			refresh_secret, {
			algorithm: 'HS256',
			expiresIn: '3d',
		})
		const redisClient = await createRedisClient();
		await redisClient.set(`${userId}.${userTokenId}`, data);
		await redisClient.expire(`${userId}.${userTokenId}`, 60 * 60 * 24 * 3);
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
const refreshTokenVerify = async (userId, refreshToken) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		refreshToken = tokenParse(refreshToken);
		if (!verifyService.isValidTokenStruct(refreshToken))
			throw Error();
		const isAdmin = adminService.isAdminUserToken(refreshToken);
		if (isAdmin) // admin은 refresh token을 주지 않는다.
			throw Error();
		const refresh_secret = isAdmin ? ADMIN_REFRESH_SECRET : JWT_REFRESH_SECRET;
		const decoded = jwt.verify(refreshToken, refresh_secret);
		logger.info(`### Request RT verified ADMIN : ${isAdmin}`);
		if (!isAdmin && decoded.id != userId) {
			throw Error();
		} else {
			logger.info("### Refresh Token ID Verified");
		}
		const redisClient = await createRedisClient();
		const savedToken = await redisClient.get(`${decoded.id}.${decoded.userTokenId}`);
		if (savedToken !== refreshToken)
		{
			logger.info("### Refresh Token Already Used");
			const keys = await redisClient.keys(`${decoded.id}.*`);
			keys.forEach(async (key) => {
				redisClient.del(key);
				logger.info(`### DEL ${key}`);
			});
			throw Error();
		}
		const newToken = await refreshTokenSign(decoded.id, isAdmin, decoded.userTokenId);
		redisClient.quit();
		return newToken;
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
		const refresh_secret = adminService.isAdminUserToken(refreshToken) ? ADMIN_REFRESH_SECRET : JWT_REFRESH_SECRET;
		const decoded = jwt.verify(refreshToken, refresh_secret);
		const redisClient = await createRedisClient();
		await redisClient.del(`${decoded.id}.${decoded.userTokenId}`);
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
