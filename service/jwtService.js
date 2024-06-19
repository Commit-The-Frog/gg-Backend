const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
const jwtException = require('../exception/jwtException.js');
const logger = require('../config/logger');
const verifyService = require('../service/verifyService.js');
const adminService = require('../service/adminService.js');
const crypto = require('crypto');
const authException = require("../exception/authException.js");

const tokenParse = (rawToken) => {
	try {
		if (rawToken.split(' ')[0] != "Bearer")
			throw Error();
		return rawToken.split(' ')[1];
	} catch(error) {
		throw new jwtException.TokenAuthorizeError("from service")
	}
}

const tokenHashCreater = () => {
	const hash = crypto.createHash('sha256');
	const uuid = crypto.randomUUID();
	hash.update(`${uuid}.${Date.now()}`);
	const base64 = hash.digest('base64');
	return base64;
}

/*	[accessTokenSign]
	userId 매개변수를 이용해서 admin 여부를 확인한다.
	access token의 payload에 user id, admin 여부 입력
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
			id : userId,
			role : adminService.isAdminUser(userId) ? 'admin' : 'client'
		}
		const accessToken = jwt.sign(
			payload,
			JWT_ACCESS_SECRET, {
			algorithm: 'HS256',
			expiresIn: '1h'
		});
		logger.info("### Access Token Signed");
		return (accessToken);
	} catch(error) {
		throw new jwtException.TokenSignError("from service")
	}
};


/*	[sameIdTokenVerify]
	token payload 내부의 id가
	requset로 들어온 userid와 같은지 확인한다.
*/
const sameIdTokenVerify = (requset_user_id, token) => {
	try {
		if (requset_user_id != jwt.decode(tokenParse(token)).id)
			throw Error();
	} catch(error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
}

const adminAccessTokenVerify = function (token) {
	try {
		token = tokenParse(token);
		if (!adminService.isAdminUserToken(token))
			throw Error();
	} catch(error) {
		throw new authException.NotAdminUserError('from service');
	}
}

/*	[accessTokenSign]
	access token verify 시도.
	access token이 admin인지 확인.
		1. admin이면, token의 userid가 admin인지 확인.
			만약 userid가 admin이 아니라면, NotAdminUserError로 실패.
		2. admin이 아니면, token을 verify.
	실패시 TokenAuthorizeError
*/
const accessTokenVerify = (accessToken) => {
	try {
		accessToken = tokenParse(accessToken);
		if (!verifyService.isValidTokenStruct(accessToken))
			throw Error();
		const isAdmin = adminService.isAdminUserToken(accessToken);
		const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
		logger.info(`### Access Token Verified ADMIN : ${isAdmin}`);
	} catch (error) {
		throw new jwtException.TokenAuthorizeError("from service");
	}
};

/*	[refreshTokenSign]
	refresh token의 payload에 user id, admin 여부 입력
	hash를 매개변수로 받게 되면, 해당 hash 키값에 redis키를 대체하여 넣는다.
	실패시 TokenSignError
*/
const refreshTokenSign = async (userId, hash) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		if (!verifyService.isValidId(userId))
			throw Error();
		const userTokenId = hash ? hash : tokenHashCreater();
		const payload = {
			id : userId,
			role : adminService.isAdminUser(userId) ? 'admin' : 'client',
			userTokenId : userTokenId
		}
		const data = jwt.sign(
			payload,
			JWT_REFRESH_SECRET, {
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
	request RT가 userId의 set에 있는지 확인
	확인 후에 RT 삭제
	실패시 TokenAuthorizeError
	성공시 true 리턴
*/
const refreshTokenVerify = async (refreshToken) => {
	try {
		refreshToken = tokenParse(refreshToken);
		if (!verifyService.isValidTokenStruct(refreshToken))
			throw Error();
		const isAdmin = adminService.isAdminUserToken(refreshToken);
		const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		logger.info(`### Request RT verified ADMIN : ${isAdmin}`);
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
		const newToken = await refreshTokenSign(decoded.id, decoded.userTokenId);
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
		const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
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
	sameIdTokenVerify,
	adminAccessTokenVerify,
	accessTokenVerify,
	refreshTokenSign,
	refreshTokenVerify,
	refreshTokenDelete
}
