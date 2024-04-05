const mariadbPool = require('../config/mariadbConfig');
const logger = require('../config/logger');
const tournamentException = require('../exception/tournamentException');

const insertVote = async function (user_id, tournament_participant_id, tournament_id) {
    let connection;
    try {
        connection = await mariadbPool.getConnection();
        await getTournamentParticipantExist(tournament_participant_id, tournament_id);
        const exist = await getVoteIdByUserId(user_id, tournament_id);
        if (exist)
            throw new tournamentException.VoteAlreadyExist('In Repository');
        await connection.query(`INSERT INTO vote (user_id, tournament_participant_id, tournament_id) VALUES (${user_id}, ${tournament_participant_id}, ${tournament_id})`);
        logger.info("### Successfully inserted vote");
    } catch (error) {
        logger.info("### Failed to insert vote");
        if (error.name != 'VoteAlreadyExist' && error.name != 'ParticipantIdNotExist')
            throw new tournamentException.VoteInsertError('In Service');
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

const getTournamentParticipantExist = async function (tournament_participant_id, tournament_id) {
    let connection;
    let result;
    try {
        connection = await mariadbPool.getConnection();
        result = await connection.query(`
            SELECT id FROM tournament_participant
            WHERE id = ${tournament_participant_id}
            AND bracket_pos IS NOT NULL
            AND tournament_id = ${tournament_id};
        `);
        if (!result[0])
            throw Error();
    } catch (error) {
        throw new tournamentException.ParticipantIdNotExist('In Repository');
    } finally {
        if (connection) connection.release();
    }
}

const getVoteIdByUserId = async function (user_id, tournament_id) {
    let connection;
    let result;
    try {
        connection = await mariadbPool.getConnection();
        result = await connection.query(`
            SELECT tournament_participant_id FROM vote
            WHERE user_id = ${user_id}
            AND tournament_id = ${tournament_id};
        `);
        logger.info("Successfully get tournament_participant_id");
    } catch (error) {
        logger.info("Failed to get tournament_participant_id");
        throw new tournamentException.GetVoteIdError('In Repository');
    } finally {
        if (connection) connection.release();
        logger.info(`### get vote id by user id result : ${JSON.stringify(result)}`);
        if (result[0])
            return result[0].tournament_participant_id;
    }
}

const getAllParticipantsInfo = async function () {
    let connection;
    let results;
    try {
        connection = await mariadbPool.getConnection();
        const query = `
            SELECT ftpi.tournament_participant_id, tp.name, ftpi.team_name, ftpi.club_name, ftpi.preliminary_rank, ftpi.formation, ftpi.favorite_coach, ftpi.career, tp.tournament_id, tp.bracket_pos, tp.message, ftpi.logo_img, user.profile_img
            FROM fifa_tournament_participant_info AS ftpi
            INNER JOIN tournament_participant AS tp
            ON tp.id = ftpi.tournament_participant_id
            INNER JOIN user
            ON tp.user_id = user.id
            WHERE tp.bracket_pos IS NOT NULL;
        `;
        results = await connection.query(query);
        logger.info("Successfully fetched all participants info");
    } catch (error) {
        logger.info("Failed to fetch all participants info");
        throw new tournamentException.GetAllParticipantsInfoError('In Repository');
    } finally {
        if (connection) connection.release();
        return results;
    }
}

module.exports = {
    insertVote,
    getVoteIdByUserId,
	getAllParticipantsInfo
};
