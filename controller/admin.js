var express = require('express');
var router = express.Router();
const tournamentService = require('../service/tournamentService.js');
var logger = require('../config/logger');

router.get('/', async function (req, res, next) {
	try {
		logger.info("!!! ADMIN PAGE REACHED !!!");
		if (!req.query.id)
			throw Error();
		const result = await tournamentService.getVoteUserByParticipantId(req.query.id, 1);
		res.status(200).send(result);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
});

module.exports = router;
