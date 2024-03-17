var express = require('express');
var router = express.Router();
const sseService = require('../service/sseService.js');
var logger = require('../config/logger');

/**
 * @swagger
 * tags:
 *   name: SSE
 *   description: SSE 관련 API
 */

/**
 * @swagger
 * /sse/subscribe:
 *   get:
 *     summary: Subscribe SSE by user id
 *     description: Subscribe SSE by user id
 *     operationId: sseSubscribe
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: user id for subscribe
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     tags: [SSE]
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: SseError
 */
/* listing events by subscribe */
router.get('/subscribe', async function (req, res, next) {
	try {
		const id = Date.now() + '.' + req.query.userId;
		sseService.addListener(id, res);
		req.on('close', function () {
			sseService.deleteListener(id);
		});
	} catch (error) {
		throw error;
	}
})


/**
 * @swagger
 * /sse/speaker:
 *   post:
 *     tags:
 *       - SSE
 *     summary: Send info to all listeners
 *     description: Send info to all listeners
 *     operationId: sseSpeaker
 *     requestBody:
 *       description: Info for listeners
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: SseError
 */
router.post('/speaker', async function (req, res, next) {
	try {
		sseService.sendInfoToListeners(req.body);
		res.send(req.body);
	} catch (error) {
		throw error;
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
