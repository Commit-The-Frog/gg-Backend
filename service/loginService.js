const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js");
const { UserNotFoundError } = require("../exception/userException.js");

module.exports = {
	init: async (code) => {
		const userInfo = await apiGetter(code);
		try {
			userRepo.findUserById(userInfo.id);
			userRepo.updateUserById(userInfo.id, userInfo.login, userInfo.image.versions.small);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				userRepo.addUser(userInfo.id, userInfo.login, userInfo.image.versions.small);
			} else {
				throw error;
			}
		}
		const accessToken = await jwt.sign(result.user_id);
		const refreshToken = await jwt.refresh(result.user_id);
		return ({
			user_id: result.user_id,
			accessToken: accessToken,
			refreshToken: refreshToken
		})
	},
	access: async (userId, refreshToken) => {
		if (jwt.refreshVerify(refreshToken, userId)) {
			const newToken = await jwt.sign(userId);
			return ({
				verified: true,
				token: newToken
			})
		} else {
			return ({
				verified: false,
				token: null
			})
		}
	}
}
