const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js");
const { UserNotFoundError } = require("../exception/userException.js");

const init = async (code) => {
	try {
		let userInfo = null;
		try {
			userInfo = await apiGetter(code);
			console.log(userInfo.id.toString(), userInfo.login, userInfo.image.versions.small);
			await userRepo.findUserById(userInfo.id);
			await userRepo.updateUserById(userInfo.id, userInfo.login, userInfo.image.versions.small);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				await userRepo.addUser(userInfo.id, userInfo.login, userInfo.image.versions.small);
			} else {
				throw new Error(error);
			}
		}
		const accessToken = await jwt.sign(userInfo.id);
		const refreshToken = await jwt.refresh(userInfo.id);
		return ({
			user_id: userInfo.id,
			accessToken: accessToken,
			refreshToken: refreshToken
		})
	} catch (error) {
		throw error;
	}
};

const access = async (userId, refreshToken) => {
	try {
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
	} catch (error) {
		throw error;
	}
};

module.exports = {
	init,
	access
}
