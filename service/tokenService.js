const jwt = require("./jwtService.js")
const apiGetter = require("./loginService.js")
const userRepo = require("../repository/userRepository.js")

app.get("/login", async (req, res) => {
	const userInfo = apiGetter(req.headers.code);
	const result = await userRepo.addUser(userInfo.name, userInfo.img);
	console.log(result._id)
})

app.get("/jwt/sign", async (req, res) => {
	const user_id = await req.query.user_id;
	const token = await jwt.sign(user_id);
	console.log(user_id);
	console.log(token);
	res.send(token);
})

app.get("/jwt/verify", async (req, res) => {
	const data = await req.headers.token;
	const user_id = await req.query.user_id;
	console.log(user_id);
	console.log(data);
	res.send(jwt.verify(data));
})

app.get("/jwt/refresh", async (req, res) => {
	const user_id = await req.query.user_id;
	const token = await jwt.refresh(user_id);
	console.log(user_id);
	console.log(token);
	res.send(token);
})

app.get("/jwt/refresh_verify", async (req, res) => {
	const data = await req.headers.token;
	const user_id = await req.query.user_id;
	const result = await jwt.refreshVerify(data, user_id);
	res.send(result);
})
