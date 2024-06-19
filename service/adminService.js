require('dotenv').config();
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const authException = require("../exception/authException.js");

const isAdminUser = function (id) {
	if (!(id instanceof String))
		id = id.toString();
	const idArray = process.env.ADMIN_USER_ID_LIST.split(':');
	if (idArray.includes(id))
	{
		logger.info("### User Is Admin");
		return true;
	}
	else
		return false;
}

const isAdminUserToken = function (token) {
	const tokenPayload = jwt.decode(token);
	if (tokenPayload.role === 'admin')
	{
		if (!isAdminUser(tokenPayload.id))
			throw new authException.NotAdminUserError("from service");
		return true;
	}
	return false;
}

module.exports = {
	isAdminUser,
	isAdminUserToken
}
