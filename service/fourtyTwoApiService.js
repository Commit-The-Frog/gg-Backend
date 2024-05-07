require('dotenv').config();

const { AuthorizationCode } = require ('simple-oauth2');
const authException = require ('../exception/authException');
const axios = require('axios');
const logger = require('../config/logger');

async function apiGetter(code) {
	try {
		const client = new AuthorizationCode({
			client: {
				id: process.env.LOGIN_42_API_UID,
				secret: process.env.LOGIN_42_API_SECRET
			},
			auth: {
				tokenHost: process.env.TOKENHOST
			}});
		const accessToken = await client.getToken({
			code: code,
			redirect_uri: `${process.env.REDIRECT_URI}`
		});
		logger.info("### Get Token From API Server");
		const apiUrl = `${process.env.TOKENHOST}/v2/me`;
		const response = await axios.get(apiUrl, {
			timeout: 10000, // 10초 후에 timeout
			headers: {
				Authorization: `Bearer ${accessToken.token.access_token}`
			}});
		return (response.data);
	} catch (error){
		logger.info(`${error}`);
		throw new authException.ApiInfoGetError("in service");
	}
}

module.exports = apiGetter;
