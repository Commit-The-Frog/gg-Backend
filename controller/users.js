var express = require('express');
var router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User 관련 API
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'respond with a resource'
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
