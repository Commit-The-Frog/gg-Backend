const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const tournamentRepository = require('../repository/tournamentRepository');
const jwtService = require('../service/jwtService');
const verifyService = require('../service/verifyService.js');
const limitDate = new Date(process.env.LIMIT_VOTE_TIME);
const tournamentException = require('../exception/tournamentException.js');

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
			"vote" : userVote,
			"fin" : await checkRequestTime()
		});
	}
}

const postVoteInfo = async function (token, vote_id, tournament_id) {
	try {
		if (await checkRequestTime())
			throw new tournamentException.VoteTimeOut();
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

const checkRequestTime = async () => {
	const now = new Date();
	if (now > limitDate) {
		logger.info("### Vote Time Out");
		return true;
	} else {
		return false;
	}
}

module.exports = {
	getAllTournamentInfo,
	postVoteInfo
}
