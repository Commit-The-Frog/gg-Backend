var express = require('express');
var router = express.Router();
const userService = require('../service/userService.js');
const searchService = require('../service/searchService.js');
var logger = require('../config/logger');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User 관련 API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users' info
 *     description: Get users' info by get request
 *     operationId: getUsers
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: value of user id to get user info
 *         required: false
 *         explode: false
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         description: value of user name to get user info
 *         required: false
 *         explode: true
 *         schema:
 *           type: string
 *       - name: pattern
 *         in: query
 *         description: user names for auto fill
 *         required: false
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: InternalServerError
 *  */
/* GET users listing. */
router.get('/', async function (req, res, next) {
	try {
		let result;
		if (req.query.id) {
			result = await userService.getOneUserInfo(req.query.id);
		} else if (req.query.name) {
			result = await userService.getOneUserInfoByName(req.query.name);
		} else if (req.query.pattern) {
			result = await searchService.findUserNameByPatternInRedis(req.query.pattern + '*');
		} else {
			result = await userService.getUsersInfo();
		}
		res.status(200).send(result);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
});

/**
 * @swagger
 * /users/add/{name}:
 *   post:
 *     tags:
 *       - Users
 *     summary: add user name
 *     description: add user name
 *     operationId: adduser
 *     parameters:
 *       - name: name
 *         in: path
 *         description: name of user name starts with
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
 *       '404':
 *         description: UserNotFoundError
 *       '500':
 *         description: InternalServerError
 */
router.post('/add/:name', async function (req, res, next) {
	try {
		logger.info(req.params.name);
		await searchService.addUserNameInRedis(req.params.name);
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
