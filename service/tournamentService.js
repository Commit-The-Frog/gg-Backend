const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const tournamentRepository = require('../repository/tournamentRepository');
const jwtService = require('../service/jwtService');
const verifyService = require('../service/verifyService.js');
const limitDate = new Date(process.env.LIMIT_VOTE_TIME);
const tournamentException = require('../exception/tournamentException.js');
const verifyException = require('../exception/verifyException.js');

const getAllTournamentInfo = async function (token, tournament_id) {
	let participantsInfo;
	let userVote;
	try {
		participantsInfo = await tournamentRepository.getAllParticipantsInfo();
		const parsedToken = jwtService.tokenParse(token);
		const tokenPayload = jwt.decode(parsedToken);
		jwtService.accessTokenVerify(tokenPayload.id, token);
		if (!verifyService.isValidId(tokenPayload.id))
			throw new verifyException.inputFormatError('in service');
		if (!verifyService.isValidId(tournament_id))
			throw new verifyException.inputFormatError('in service');
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
		if (!verifyService.isValidId(tokenPayload.id))
			throw new verifyException.inputFormatError('in service');
		if (!verifyService.isValidId(vote_id))
			throw new verifyException.inputFormatError('in service');
		if (!verifyService.isValidId(tournament_id))
			throw new verifyException.inputFormatError('in service');
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

const getVoteUserByParticipantId = async (tournament_participant_id, tournament_id) => {
	try {
		if (!verifyService.isValidId(tournament_participant_id))
			throw new verifyException.inputFormatError('in service');
		if (!verifyService.isValidId(tournament_id))
			throw new verifyException.inputFormatError('in service');
		const results = await tournamentRepository.getVoteUserByParticipantId(tournament_participant_id, tournament_id);
		return results;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getAllTournamentInfo,
	postVoteInfo,
	getVoteUserByParticipantId
}
