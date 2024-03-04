const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js");
const { UserNotFoundError } = require("../exception/userException.js");

/*  [INIT]
	code 로 42 API 에서 유저 정보 받아옴
	유저 조회 후 존재하면 정보 업데이트, 없으면 생성(회원가입)
	해당 유저정보로 AT, RT 발급 후 리턴 */
const setUserAndCreateToken = async (code) => {
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

/*	[createNewAccessToken]
	RT 를 받아서 검증
	새로운 AT 발급
	실패시 (false, null)
	성공시 (true, newToken) */
const createNewAccessToken = async (userId, refreshToken) => {
	try {
		if (await jwt.refreshVerify(refreshToken, userId)) {
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
	setUserAndCreateToken,
	createNewAccessToken
}
