const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const tournamentRepository = require('../repository/tournamentRepository');
const jwtService = require('../service/jwtService');
const { token } = require('morgan');

const getAllTournamentInfo = async function (token) {
	let participantsInfo;
	let userVote;
	try {
		participantsInfo = await tournamentRepository.getAllParticipantsInfo();
		jwtService.accessTokenVerify(token);
		const tokenPayload = jwt.decode(token);
		userVote = await tournamentRepository.getVoteIdByUserId(tokenPayload.id);
	} catch (error) {
		if (error.name != 'TokenAuthorizeError')
			throw error;
	} finally {
		return ({
			"players" : participantsInfo,
			"vote" : userVote
		});
	}
}

const postVoteInfo = async function (token, vote_id) {
	try {
		jwtService.accessTokenVerify(token);
		const tokenPayload = jwt.decode(token);
		await tournamentRepository.insertVote(tokenPayload.userVote, vote_id);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getAllTournamentInfo,
	postVoteInfo
}
