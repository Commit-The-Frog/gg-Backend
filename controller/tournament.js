var express = require('express');
var router = express.Router();
const tournamentService = require('../service/tournamentService.js');
var logger = require('../config/logger');

/**
 * @swagger
 * tags:
 *   name: Tournament
 *   description: Tournament 관련 API
 */

/**
 * @swagger
 * /tournament:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get tournament info
 *     description: Get tournament info by get request
 *     operationId: getTournamentInfo
 *     tags: [Tournament]
 *     responses:
 *       '200':
 *         description: Value of all players + user vote info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tournamentPlayers'
 *       '500':
 *         description: InternalServerError
 *  */
/* GET users listing. */
router.get('/', async function (req, res, next) {
	try {
		let result;
		result = tournamentService.getAllTournamentInfo(req.headers.authorization);
		res.status(200).send(result);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
});

/**
 * @swagger
 * /tournament:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: insert vote info
 *     description: insert vote info
 *     operationId: insertVote
 *     parameters:
 *       - vote: name
 *         in: query
 *         description: number of player to vote
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: InternalServerError
 */
router.post('/', async function (req, res, next) {
	try {
		tournamentService.postVoteInfo(req.headers.authorization, req.query.vote);
		res.status(200).send();
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

module.exports = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65e56ff8984f3a5190f0c4e6"
 *         user_id:
 *           type: string
 *           example: "158010"
 *         name:
 *           type: string
 *           example: "minjacho"
 *         displayname:
 *           type: string
 *           example: "MinJae Choi"
 *         profile_img:
 *           type: string
 *           example: "https://cdn.intra.42.fr/users/1bf8948249e8d63a265c19b793c62bc9/small_minjacho.jpg"
 *         createdAt:
 *           type: string
 *           example: "2024-03-04T06:53:44.216Z"
 *         updatedAt:
 *           type: string
 *           example: "2024-03-04T06:53:44.216Z"
 *         __v:
 *           type: integer
 *           example: 0
 *     LoginInfo:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           example: "158010"
 *         accessToken:
 *           type: string
 *           example: "<token>"
 *         refereshToken:
 *           type: string
 *           example: "<token>"
 *     UserName:
 *       type: string
 *       properties:
 *         userName
 */
