var express = require('express');
var router = express.Router();
const userService = require('../service/userService.js');

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
 *     summary: Get all users' info
 *     description: Get all users' info by get request
 *     operationId: getUsers
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *         '500':
 *           description: InternalServerError
 */
/* GET users listing. */
router.get('/', async function (req, res, next) {
	try {
		const usersInfo = await userService.getUsersInfo();
		res.status(200).send(usersInfo);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
});

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get one user's info
 *     description: Get one user's info by get request
 *     operationId: getOneUser
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: value of user id to get user info
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
router.get('/:userId', async function (req, res, next) {
	try {
		const userInfo = await userService.getOneUserInfo(req.params.userId);
		res.status(200).send(userInfo);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get one user's info
 *     description: Get one user's info by get request
 *     operationId: getOneUser
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: value of user id to get user info
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
router.get('/findOne', async function (req, res, next) {
	try {
		const userInfo = await userService.getOneUserInfoByName(req.query.name);
		res.status(200).send(userInfo);
	} catch(error) {
		res.status(error.status || 500).send(error.name || "InternalServerError");
	}
})

router.get('/findNames', async function (req, res, next) {
	try {
		const userInfo = await userService.getUserNamesStartWith(req.query.reg);
		res.status(200).send(userInfo);
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
 */
