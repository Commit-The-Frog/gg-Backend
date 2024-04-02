const mariadbPool = require('../config/mariadbConfig');
const logger = require('../config/logger');
const tournamentException = require('../exception/tournamentException');

const insertVote = async function (user_id, vote_id) {
    let connection;
    try {
        connection = await mariadbPool.getConnection();
        await connection.query(`INSERT INTO vote (user_id, vote_id) VALUES (${user_id}, ${vote_id})`);
        logger.info("### Successfully inserted vote");
    } catch (error) {
        logger.info("### Failed to insert vote:", error);
        throw new tournamentException.VoteInsertError('In Repository');
    } finally {
        if (connection) connection.release();
    }
}

const getVoteIdByUserId = async function (userId) {
    let connection;
    try {
        connection = await mariadbPool.getConnection();
        const results = await connection.query(`SELECT vote_id FROM vote WHERE user_id = ${userId}`);
        logger.info("Successfully get vote_id");
        return results;
    } catch (error) {
        logger.info("Failed to get vote_id:", error);
        throw new tournamentException.GetVoteIdError('In Repository');
    } finally {
        if (connection) connection.release();
    }
}

const getAllParticipantsInfo = async function () {
    let connection;
    try {
        connection = await mariadbPool.getConnection();
        const query = `
            SELECT *
            FROM tournament_participant AS tp
            INNER JOIN fifa_tournament_participant_info AS ftpi
            ON tp.id = ftpi.tournament_participant_id;
        `;
        const results = await connection.query(query);
        logger.info("Successfully fetched all participants info");
        return results;
    } catch (error) {
        logger.info("Failed to fetch all participants info:", error);
        throw new tournamentException.GetAllParticipantsInfoError('In Repository');
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    insertVote,
    getVoteIdByUserId,
	getAllParticipantsInfo
};
