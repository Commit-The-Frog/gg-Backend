const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const access_secret = process.env.JWT_ACCESS_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;

// Access Token 생성
const sign = (userId) => {
	userId = userId.toString();
	const payload = {
		id: userId
	}
	return jwt.sign(payload, access_secret, {
		algorithm: 'HS256',
		expiresIn: '1h'
	});
};

// Access Token 검증
const verify = (token) => {
	let decoded = null;
	try {
		decoded = jwt.verify(token, access_secret);
		return {
			verified: true,
			id: decoded.id
		};
	} catch (error) {
		return {
			verified: false,
			message: error.message
		};
	}
};


//
const refresh = async (userId) => { // refresh token 발급
	userId = userId.toString();
	const data = jwt.sign({
		id: userId
	}, refresh_secret, {
		algorithm: 'HS256',
		expiresIn: '14d',
	})
	try{
		const redisClient = await createRedisClient();
		console.log(redisClient);
		redisClient.set(userId, data);
		return data;
	} catch (err) {
		throw new Error(err);
	}
}

const refreshVerify = async (token, userId) => { // refresh token 검증
	userId = userId.toString();
	try {
		const redisClient = await createRedisClient();
		const data = await redisClient.get(userId);
		if (token === data) {
			try {
				jwt.verify(token, refresh_secret);
				return true;
			} catch (err) {
				return false;
			}
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
}

module.exports = {
	sign,
	verify,
	refresh,
	refreshVerify
}
