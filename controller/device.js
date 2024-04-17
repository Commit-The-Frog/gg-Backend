const express = require('express');
const router = express.Router();
const reportGetService = require('../service/reportGetService.js');

/**
 * @swagger
 * tags:
 *   name: device
 *   description: device 관련 API
 */

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: 디바이스 목록 조회
 *     description: 콘솔에 해당하는 컨트롤러나 본체의 이름과 상태 받아오기.
 *     operationId: getDeviceInfo
 *     tags: [device]
 *     parameters:
 *       - name: console_type
 *         in: query
 *         description: "해당하는 디바이스 목록을 받기 위한 콘솔 종류 PS5  1 | NINTENDO  2 | XBOX  3"
 *         required: false
 *         explode: false
 *         schema:
 *           type: int
 *     responses:
 *       '200':
 *         description: 다양한 리스트 받음
 *       '500':
 *         description: InternalServerError
 *
 */
router.get('/', async (req, res, next) => {
	let result;
	try {
		result = await reportGetService.getDeviceListByType(req.query.console_type);
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: (관리자) 디바이스 추가
 *     description:
 *     operationId: postDevice
 *     tags: [device]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: "id (np1, np2, xc1 ...)"
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: console_id
 *         in: query
 *         description: "console_id (1번이 PS5, 2번이 닌텐도, 3번이 XBOX)"
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: "status (0번이 고장, 1번이 수리중, 2번이 정상)"
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Add Success
 *       '500':
 *         description: InternalServerError
 *
 */

router.post('/', async (req, res, next) => {
	let result;
	try {
		await reportGetService.insertDevice(req.query.id, req.query.console_id, req.query.status)
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /devices:
 *   delete:
 *     summary: (관리자) 디바이스 삭제
 *     description:
 *     operationId: deleteDevice
 *     tags: [device]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: "id (np1, np2, xc1 ...)"
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Delete Success
 *       '500':
 *         description: InternalServerError
 *
 */

router.delete('/', async (req, res, next) => {
	let result;
	try {
		await reportGetService.deleteDevice(req.query.id);
		res.status(200).send(result);
	} catch (error) {
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
 *     Tournament:
 *       type: object
 *       properties:
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tournament_participant_id:
 *                 type: integer
 *                 example: 1
 *               intra_id:
 *                 type: string
 *                 example: minjacho
 *               team_name:
 *                 type: string
 *                 example: Team A
 *               club_name:
 *                 type: string
 *                 example: Club X
 *               preliminary_rank:
 *                 type: integer
 *                 example: 1
 *               formation:
 *                 type: string
 *                 example: 4-3-3
 *               favorite_coach:
 *                 type: string
 *                 example: Coach John
 *               career:
 *                 type: string
 *                 example: 10 years of experience
 *               tournament_id:
 *                 type: integer
 *                 example: 1
 *               bracket_pos:
 *                 type: integer
 *                 example: 3
 *               message:
 *                 type: string
 *                 example: Message 1
 *               logo_img:
 *                 type: string
 *                 example: img.jpg
 *         vote:
 *           type: integer
 *           example: 3
 *         fin:
 *           type: boolean
 *           example: false
 */
