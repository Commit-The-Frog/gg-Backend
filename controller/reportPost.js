const express = require('express');
const router = express.Router();
const reportPostService = require('../service/reportPostService');

/** 
 * @swagger
 * tags:
 *   name: ReportPost
 *   description: Report 관련 API
 */

/**
 * @swagger
 * paths:
 *   /reports:
 *     post:
 *       tags:
 *         - ReportPost
 *       summary: 신고 생성
 *       parameters:
 *         - name: data
 *           in: query
 *           description: 고장접수 정보(base64)
 *           required: true
 *           schema:
 *             type: string
 */
router.post('/', async (req, res, next) => {
	try {
		const result = await reportPostService.addReport(
			req.query.data
		);
		console.log(result);
		res.send(result);
	} catch (error) {
		res.send('error');
	}
});

module.exports = router;