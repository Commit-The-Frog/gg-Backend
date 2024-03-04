const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const access_secret = process.env.JWT_ACCESS_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;
const jwtException = require('../exception/jwtException.js');

/*	[accessTokenSign]
	access token의 payload에 user id 입력
	access token 발급
	실패시 TokenSignError
*/
const accessTokenSign = (userId) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		const payload = {
			id: userId
		}
		const accessToken = jwt.sign(
			payload,
			access_secret, {
			algorithm: 'HS256',
			expiresIn: '1h'
		});
		console.log("### Access Token Signed");
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
		if (!(userId instanceof String))
		userId = userId.toString();
		const decoded = jwt.verify(accessToken, access_secret);
		console.log("### Access Token Verified");
		if (decoded.id != userId) {
			throw new Error();
		}
		console.log("### Access Token ID Verified");
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
		const data = jwt.sign({
			id: userId
		}, refresh_secret, {
			algorithm: 'HS256',
			expiresIn: '14d',
		})
		const redisClient = await createRedisClient();
		redisClient.set(userId, data, 'EX', 60 * 60 * 24 * 14); // 2주 후에 만료
		console.log("### Refresh Token Saved in Redis")
		return (data);
	} catch (error) {
		throw new jwtException.TokenSignError("from service");
	}
}

/*	[refreshTokenVerify]
	redisClient에서 받은 RT와 파라미터 RT 비교
	같으면 파라미터의 RT의 유효성 검사
	유효성 검증시 userId를 payload의 userId와 비교
	실패시 TokenAuthorizeError
	성공시 true 리턴
*/
const refreshTokenVerify = async (refreshToken, userId) => {
	try {
		if (!(userId instanceof String))
			userId = userId.toString();
		const redisClient = await createRedisClient();
		const data = await redisClient.get(userId);
		console.log("### Redis Refresh Token Successfully Searched");
		if (refreshToken === data) {
			const decoded = jwt.verify(refreshToken, refresh_secret);
			if (decoded.id != userId)
				throw new Error();
		}
		else {
			throw new Error();
		}
		return (true);
	} catch (error) {
		return new jwtException.TokenAuthorizeError("from service");
	}
}

module.exports = {
	accessTokenSign,
	accessTokenVerify,
	refreshTokenSign,
	refreshTokenVerify
}
