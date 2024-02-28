require('dotenv').config();

const { AuthorizationCode } = require ('simple-oauth2');

async function getClientInfo(code) {
	try {
		const client = new AuthorizationCode({
			client: {
				id: process.env.PUBLIC_ID,
				secret: process.env.SECRET_KEY
			},
			auth : {
				tokenHost: `${process.env.TOKENHOST}`
			}});
		const accessToken = await client.getToken({
			code: code,
			redirect_uri: `${process.env.REDIRECT_URI}`
		});
		const apiUrl = `${process.env.TOKENHOST}/v2/me`;
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${accessToken.token.access_token}`
			}
		});
		return (response.data);
	} catch (error){
		return {
			code: error.code,
			message: error.message
		};
	}
}
