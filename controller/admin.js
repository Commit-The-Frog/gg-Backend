const express = require('express');
const router = express.Router();
const tournamentService = require('../service/tournamentService.js');
const logger = require('../config/logger');
const jwtService = require('../service/jwtService');
const bookService = require('../service/bookService');
const adminService = require('../service/adminService.js');

// router.get('/', async (req, res, next) => {
// 	try {
// 		logger.info("!!! ADMIN PAGE REACHED !!!");
// 		if (!req.query.id)
// 			throw Error();
// 		const result = await tournamentService.getVoteUserByParticipantId(req.query.id, 1);
// 		res.status(200).send(result);
// 	} catch(error) {
// 		res.status(error.status || 500).send(error.name || "InternalServerError");
// 	}
// });

/**
 * @swagger
 * paths:
 *   /admin/reservation:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Admin
 *       summary: 관리자 예약 삭제
 *       parameters:
 *         - name: userId
 *           in: query
 *           description: 유저 id
 *           required: true
 *           schema:
 *             type: string
 *         - name: bookId
 *           in: query
 *           description: 예약 id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: 삭제 성공
 *         '404':
 *           description: 사용자를 찾지 못함
 */
router.delete('/reservation', async (req, res, next) => {
	try {
		logger.info("!!! ADMIN PAGE REACHED !!!");
		jwtService.adminAccessTokenVerify(req.headers.authorization);
		jwtService.accessTokenVerify(req.headers.authorization);
		await bookService.deleteBookById(
			req.query.userId,
			req.query.bookId
		);
		res.status(200).send('success');
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *         role:
 *           type: string
 *           example: "client"
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
 *     TokenSet:
 *       type: object
 *       properties:
 *         admin:
 *           type: string
 *           example: "true"
 *         accessToken:
 *           type: string
 *           example: "<token>"
 *         refreshToken:
 *           type: string
 *           example: "<token>"
 */
