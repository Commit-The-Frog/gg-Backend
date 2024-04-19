const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js");
const { UserNotFoundError } = require("../exception/userException.js");
const searchService = require('./searchService.js');
const adminService = require('./adminService.js');

/*  [INIT]
	code 로 42 API 에서 유저 정보 받아옴
	유저 조회 후 존재하면 정보 업데이트, 없으면 생성(회원가입)
	해당 유저정보로 AT, RT 발급 후 리턴 */
const setUserAndCreateToken = async (code) => {
	try {
		let userInfo = null;
		try {
			userInfo = await apiGetter(code);
			await userRepo.findUserById(userInfo.id);
			await userRepo.updateUserById(userInfo.id, userInfo.login, userInfo.displayname, userInfo.image.versions.small, userInfo.image.versions.micro);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				await userRepo.addUser(userInfo.id, userInfo.login, userInfo.displayname, userInfo.image.versions.small, userInfo.image.versions.micro);
				await searchService.addUserNameInRedis(userInfo.login, userInfo.id);
			} else {
				throw error;
			}
		}
		const accessToken = await jwt.accessTokenSign(userInfo.id, adminService.isAdminUser(userInfo.id));
		const refreshToken = await jwt.refreshTokenSign(userInfo.id, adminService.isAdminUser(userInfo.id));
		return ({
			user_id: userInfo.id,
			role : adminService.isAdminUser(userInfo.id) ? 'admin' : 'client',
			accessToken: accessToken,
			refreshToken: refreshToken
		})
	} catch (error) {
		throw error;
	}
};

/*	[createNewTokenSet]
	RT 를 받아서 검증
	새로운 AT, RT 발급
	성공시 Token set 반환 */
const createNewTokenSet = async (userId, refreshToken) => {
	try {
		await jwt.refreshTokenVerify(refreshToken, userId);
		const newRefreshToken = await jwt.refreshTokenSign(userId, adminService.isAdminUser(userId));
		const newAccessToken = await jwt.accessTokenSign(userId, adminService.isAdminUser(userId));
		return ({
			admin: adminService.isAdminUser(userId),
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		});
	} catch (error) {
		throw error;
	}
};

/*	[logoutRefreshToken]
	RT 를 받아서 검증
	RT 를 Redis에서 삭제
	성공시 status 200 반환 */
const logoutRefreshToken = async (userId, refreshToken) => {
	try {
		await jwt.refreshTokenVerify(refreshToken, userId);
		return true;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	setUserAndCreateToken,
	createNewTokenSet,
	logoutRefreshToken
}
