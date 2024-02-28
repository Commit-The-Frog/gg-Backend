const jwt = require('jsonwebtoken');
const createRedisClient = require('./redisService.js');
const access_secret = process.env.JWT_ACCESS_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;

module.exports = {
	sign: (userId) => { // access token 발급
		const payload = {
			id: userId
		}
		return jwt.sign(payload, access_secret, { // access_secret 발급
			algorithm: 'HS256',
			expiresIn: '1h'
		});
	},
	verify: (token) => { // access token 검증
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
	},
	refresh: async (userId) => { // refresh token 발급
		const data = jwt.sign({
			id: userId
		}, refresh_secret, {
			algorithm: 'HS256',
			expiresIn: '14d',
		})
		try{
			const redisClient = await createRedisClient();
			// console.log(redisClient);
			redisClient.set(userId, data, (err, reply) => {
				if (err) {
					console.error("refresh token add : " + err);
				} else {
					console.log("refresh token add : " + reply);
				}
			})
			return data
		} catch (err) {
			throw new Error(err);
			return false;
		}
	},
	refreshVerify: async (token, userId) => { // refresh token 검증
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
}
