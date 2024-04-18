const express = require('express');
const router = express.Router();
const reportPostService = require('../service/reportPostService');
const reportGetService = require('../service/reportGetService');

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Report 관련 API
 */

/**
 * @swagger
 * paths:
 *   /reports:
 *     post:
 *       tags:
 *         - Report
 *       summary: (사용자) 신고 생성
 *       parameters:
 *         - name: data
 *           in: query
 *           description: 고장접수 정보(base64)
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: 접수 성공
 *         '500':
 *           description: 서버 에러
 */
router.post('/', async (req, res, next) => {
	try {
		const result = await reportPostService.addReport(
			req.query.data
		);
		res.send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
});

/**
 * @swagger
 * paths:
 *   /reports:
 *     get:
 *       tags:
 *         - Report
 *       summary: (관리자) 신고 목록 조회
 *       responses:
 *         '200':
 *           description: 조회 성공
 */
router.get('/', async (req, res, next) => {
	try {
		const result = await reportPostService.findAllReport();
		res.send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

/**
 * @swagger
 * paths:
 *   /reports:
 *     patch:
 *       tags:
 *         - Report
 *       summary: (관리자) 신고 상태 업데이트
 *       parameters:
 *         - name: id
 *           in: query
 *           description: 업데이트할 신고 id
 *         - name: status
 *           in: query
 *           description: 상태 정보 (접수됨 0 | 수리중 1 | 완료 2)
 *       responses:
 *         '200':
 *           description: 업데이트 성공
 */
router.patch('/', async (req, res, next) => {
	try {
		await reportPostService.changeReportStatus(
			req.query.id,
			req.query.status
		);
		res.status(200).send('successfully updated report status');
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

/**
 * @swagger
 * paths:
 *   /reports:
 *     delete:
 *       tags:
 *         - Report
 *       summary: (관리자) 신고 삭제
 *       parameters:
 *         - name: id
 *           in: query
 *           description: 삭제할 신고 id
 *       responses:
 *         '200':
 *           description: 업데이트 성공
 */
router.delete('/', async (req, res, next) => {
	try {
		await reportPostService.removeReport(req.query.id);
		res.status(200).send('successfully deleted report');
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})


/**
 * @swagger
 * /reports/types:
 *   get:
 *     summary: 신고를 위한 고장 유형과 버튼 매핑 받기
 *     description: 고장 유형 + 버튼 정보 + 버튼 고장 유형
 *     operationId: getReportInfo
 *     tags: [Report]
 *     parameters:
 *       - name: device
 *         in: query
 *         description: 고장 유형와 버튼 매핑 정보 받을 디바이스 ex) np1, xc1 ...
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 디바이스에 해당하는 선택지 리스트 받음
 *       '500':
 *         description: InternalServerError
 *
 */
router.get('/types', async (req, res, next) => {
	let result;
	try {
		result = await reportGetService.getMultipleListByControllerType(req.query.device);
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || 'InternalServerError');
	}
})

/**
 * @swagger
 * /reports/types/malfunction_type:
 *   post:
 *     summary: (관리자) malfunction_type 새로 추가
 *     description: (관리자) malfunction_type 새로 추가 ex. (connect, 연결문제)
 *     operationId: posttypesMalfunctiontype
 *     tags: [Report]
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


router.post('/types/malfunction_type', async (req, res, next) => {
	let result;
	try {
		await reportGetService.insertMalfunctionType(req.query.name, req.query.description);
		res.status(200).send(result);
	} catch (error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /reports/types/button_malfunction_type:
 *   post:
 *     summary: (관리자) 버튼 고장 타입 추가.
 *     description: (관리자) 버튼 고장 타입 추가. ex> (unpress, 눌리지 않음)
 *     operationId: posttypesButtonMalfunctionType
 *     tags: [Report]
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


router.post('/types/button_malfunction_type', async (req, res, next) => {
	let result;
	try {
		await reportGetService.insertButtonMalfunctionType(req.query.name, req.query.description);
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
