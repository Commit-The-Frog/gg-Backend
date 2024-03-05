var express = require('express');
var router = express.Router();
const userService = require('../service/userService.js');

/* GET users listing. */
router.get('/', async function (req, res, next) {
	try {
		const usersInfo = await userService.getUsersInfo();
		res.status(200).send(usersInfo);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "Internal Server Error");
	}
});

router.get('/:userId', async function (req, res, next) {
	try {
		const userInfo = await userService.getOneUserInfo(req.params.userId);
		res.status(200).send(userInfo);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "Internal Server Error");
	}
})

module.exports = router;
