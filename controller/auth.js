const express = require('express');
const router = express.Router();
const loginService = require("../service/loginService.js");

/* LOGIN */
router.get("/login", async (req, res) => {
	try {
		result = await loginService.setUserAndCreateToken(req.query.code);
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "Internal Server Error");
	}
})

/* REDIRECTION TEST of FE */
router.get("/test", async (req, res) => {
	res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e5a9910877e1e306623ecbae62eb240fc56ab7acd22f6276836ae72077a5315f&redirect_uri=http%3A%2F%2F54.180.96.16%3A3000%2Fauth%2Flogin&response_type=code");
});

/* ACCESS TOKEN REFRESH */
router.get("/refresh", async (req, res) => {
	try{
		const result = await loginService.createNewAccessToken(req.query.userId, req.headers.authorization);
		res.status(200).send({
			authorization: result
		});
	} catch(error) {
		res.status(error.status || 500).send(error.name || "Internal Server Error");
	}
});

router.delete("/logout", async (req, res) => {
	try {
		const result = await loginService.logoutRefreshToken(req.query.userId, req.headers.authorization);
		res.status(200).send();
	} catch(error) {
		res.status(error.status || 500).send(error.name || "Internal Server Error");
	}
});

module.exports = router;
