var express = require('express');
var router = express.Router();
const sseService = require('../service/sseService.js');
var logger = require('../config/logger');

router.get('/subscribe', async function (req, res, next) {
	try {
		const id = req.query.userId;
		sseService.addListener(id, res);
		req.on('close', function () {
			sseService.deleteListener(id);
		});
	} catch (error) {
		throw error;
	}
})

router.post('/speaker', async function (req, res, next) {
	try {
		sseService.sendInfoToListeners(req.body);
		res.send(req.body);
	} catch (error) {
		throw error;
	}
})

module.exports = router;
