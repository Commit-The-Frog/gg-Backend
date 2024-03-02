var express = require('express');
var router = express.Router();

const jwt = require("../service/jwtService.js")
const apiGetter = require("../service/authService.js")
const userRepo = require("../repository/userRepository.js")
const login = require("../service/loginService.js")

router.get("/login", async (req, res) => {
	try {
		result = await login.init(req.query.code);
		res.status(200).send(result);
	} catch (error) {
		res.send({
			stat: error.stat,
			message: error.message
		});
	}
})

// router.get("/test", async (req, res) => {
// 	res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-14d5f5759457b14c79fed9c8777b6f58f50adb219baeb9d22c040626453e7eea&redirect_uri=http%3A%2F%2F10.18.226.23%3A3000%2Fauth&response_type=code");
// });

router.get("/token", async (req, res) => {
	const result = await login.access(req.query.userId, req.headers.refreshToken);
	if (result.verified) {
		res.status(200).send({
			token: result.token
		});
	} else {
		res.status(401).send();
	}
})

// router.get("/verify", async (req, res) => {
// 	const data = await req.headers.token;
// 	const user_id = await req.query.user_id;
// 	console.log(user_id);
// 	console.log(data);
// 	res.send(jwt.verify(data));
// })

router.get("/refresh", async (req, res) => {
	const user_id = await req.query.user_id;
	const token = await jwt.refresh(user_id);
	console.log(user_id);
	console.log(token);
	res.send(token);
})

// router.get("/refresh_verify", async (req, res) => {
// 	const data = await req.headers.token;
// 	const user_id = await req.query.user_id;
// 	const result = await jwt.refreshVerify(data, user_id);
// 	res.send(result);
// })

module.exports = router;
