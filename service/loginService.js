const jwt = require("../service/jwtService.js")
const apiGetter = require("./fourtyTwoApiService.js")
const userRepo = require("../repository/userRepository.js");
const authException = require("../exception/authException.js");
const { UserNotFoundError } = require("../exception/userException.js");
const searchService = require('./searchService.js');
const adminService = require('./adminService.js');

/*  [INIT]
	code 로 42 API 에서 유저 정보 받아옴
	adminLogin이면 admin용 at, rt를 생성해서 보내준다.
	유저 조회 후 존재하면 정보 업데이트, 없으면 생성(회원가입)
	해당 유저정보로 AT, RT 발급 후 리턴 */
const setUserAndCreateToken = async (code, adminLogin) => {
	try {
		let userInfo = null;
		try {
			userInfo = await apiGetter(code);
			if (adminLogin && !adminService.isAdminUser(userInfo.id))
				throw new authException.NotAdminUserError('In Service');
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
		const accessToken = jwt.accessTokenSign(userInfo.id, adminLogin);
		const refreshToken = adminLogin ? null : await jwt.refreshTokenSign(userInfo.id, adminLogin);
		return ({
			user_id: userInfo.id,
			role : adminLogin ? 'admin' : 'client',
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
		await jwt.refreshTokenVerify(userId, refreshToken);
		const isAdmin = adminService.isAdminUserToken(jwt.tokenParse(refreshToken));
		const newAccessToken = jwt.accessTokenSign(userId, isAdmin);
		const newRefreshToken = isAdmin ? null : await jwt.refreshTokenSign(userId, isAdmin);
		return ({
			role: isAdmin ? 'admin' : 'client',
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
		await jwt.refreshTokenVerify(userId, refreshToken);
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
