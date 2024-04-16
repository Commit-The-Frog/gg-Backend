const express = require('express');
const router = express.Router();
const reportGetService = require('../service/reportGetService.js');

/**
 * @swagger
 * tags:
 *   name: report
 *   description: report 관련 API
 */

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Report Format Info Get
 *     description: Report Format Info Get
 *     operationId: getReportInfo
 *     tags: [report]
 *     parameters:
 *       - name: console_type
 *         in: query
 *         description: get device list by console type
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: device
 *         in: query
 *         description: get list compound by device
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
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
		if (req.query.console_type) {
			result = await reportGetService.getDeviceListByType(req.query.console_type);
		} else if (req.query.device) {
			result = await reportGetService.getMultipleListByControllerType(req.query.device);
		}
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /report/testDevice:
 *   post:
 *     summary: testDevice
 *     description: testDevice
 *     operationId: postReportInfo
 *     tags: [report]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: id
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: console_id
 *         in: query
 *         description: console_id
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: status
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 다양한 리스트 받음
 *       '500':
 *         description: InternalServerError
 *
 */

const reportGetRepository = require('../repository/reportGetRepository');

router.post('/testDevice', async (req, res, next) => {
	let result;
	try {
		reportGetRepository.addDevice(req.query.id, req.query.console_id, req.query.status)
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /report/testMalfunctionType:
 *   post:
 *     summary: testMalfunctionType
 *     description: testMalfunctionType
 *     operationId: posttestMalfunctionType
 *     tags: [report]
 *     parameters:
 *       - name: name
 *         in: query
 *         description: name
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: description
 *         in: query
 *         description: description
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 다양한 리스트 받음
 *       '500':
 *         description: InternalServerError
 *
 */


router.post('/testMalfunctionType', async (req, res, next) => {
	let result;
	try {
		reportGetRepository.addMalfunctionType(req.query.name, req.query.description);
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /report/testButtonMalfunctionType:
 *   post:
 *     summary: testButtonMalfunctionType
 *     description: testButtonMalfunctionType
 *     operationId: posttestButtonMalfunctionType
 *     tags: [report]
 *     parameters:
 *       - name: name
 *         in: query
 *         description: name
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: description
 *         in: query
 *         description: description
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 다양한 리스트 받음
 *       '500':
 *         description: InternalServerError
 *
 */


router.post('/testButtonMalfunctionType', async (req, res, next) => {
	let result;
	try {
		reportGetRepository.addButtonMalfunctionType(req.query.name, req.query.description);
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
