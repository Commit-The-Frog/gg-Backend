const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const tournamentRepository = require('../repository/tournamentRepository');
const jwtService = require('../service/jwtService');
const verifyService = require('../service/verifyService.js');

const getAllTournamentInfo = async function (token, tournament_id) {
	let participantsInfo;
	let userVote;
	try {
		participantsInfo = await tournamentRepository.getAllParticipantsInfo();
		const parsedToken = jwtService.tokenParse(token);
		const tokenPayload = jwt.decode(parsedToken);
		jwtService.accessTokenVerify(tokenPayload.id, token);
		verifyService.isValidId(tokenPayload.id);
		verifyService.isValidId(tournament_id);
		userVote = await tournamentRepository.getVoteIdByUserId(tokenPayload.id, tournament_id);
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

const postVoteInfo = async function (token, vote_id, tournament_id) {
	try {
		const parsedToken = jwtService.tokenParse(token);
		const tokenPayload = jwt.decode(parsedToken);
		jwtService.accessTokenVerify(tokenPayload.id, token);
		verifyService.isValidId(tokenPayload.id);
		verifyService.isValidId(vote_id);
		verifyService.isValidId(tournament_id);
		await tournamentRepository.insertVote(tokenPayload.id, vote_id, tournament_id);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getAllTournamentInfo,
	postVoteInfo
}
