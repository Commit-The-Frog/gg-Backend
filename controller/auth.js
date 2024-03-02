var express = require('express');
var router = express.Router();

const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js")

router.get("/", async (req, res) => {
	try {
		const userInfo = await apiGetter(req.query.code);
		const result = await userRepo.addUser(userInfo.id, userInfo.login, userInfo.image.versions.small);
		const accessToken = jwt.sign(result.user_id);
		const refreshToken = jwt.refresh(result.user_id);
		res.status(200).send({
			user_id: result.user_id,
			accessToken: accessToken,
			refreshToken: refreshToken
		});
	} catch (error) {
		res.send({
			stat: error.stat,
			message: error.message
		});
	}
})

router.get("/sign", async (req, res) => {
	const user_id = await req.query.user_id;
	const token = await jwt.sign(user_id);
	console.log(user_id);
	console.log(token);
	res.send(token);
})

router.get("/verify", async (req, res) => {
	const data = await req.headers.token;
	const user_id = await req.query.user_id;
	console.log(user_id);
	console.log(data);
	res.send(jwt.verify(data));
})

router.get("/refresh", async (req, res) => {
	const user_id = await req.query.user_id;
	const token = await jwt.refresh(user_id);
	console.log(user_id);
	console.log(token);
	res.send(token);
})

router.get("/refresh_verify", async (req, res) => {
	const data = await req.headers.token;
	const user_id = await req.query.user_id;
	const result = await jwt.refreshVerify(data, user_id);
	res.send(result);
})

module.exports = router;
