const mariadbPool = require('../config/mariadbConfig');
const logger = require('../config/logger');
const reportGetException = require('../exception/reportGetException');
const mariadbException = require('../exception/mariadbException');

const getConsoleList = async () => {
	let connection;
	let results;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT *
			FROM console;
		`;
		results = await connection.query(query);
		logger.info("### Successfully fetched all console info");
		return results;
	} catch (error) {
		logger.info("### Failed to fetch all console info");
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.GetConsoleListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const getDeviceListByConsoleId = async (console_id) => {
	let connection;
	let results;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT *
			FROM device
			WHERE console_id = ${console_id};
		`;
		results = await connection.query(query);
		logger.info("### Successfully fetched all device info");
		return results;
	} catch (error) {
		logger.info("### Failed to fetch all device info");
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.GetDeviceListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const getMalfunctionTypeList = async () => {
	let connection;
	let results;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT *
			FROM malfunction_type;
		`;
		results = await connection.query(query);
		logger.info("### Successfully fetched all malfunction_type info");
		return results;
	} catch (error) {
		logger.info("### Failed to fetch all malfunction_type info");
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.GetMalfunctionTypeListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const getControllerButtonTypeList = async (device_type) => {
	let connection;
	let results;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT *
			FROM controller_button_type_${device_type};
		`;
		results = await connection.query(query);
		logger.info(`### Successfully fetched all controller_button_type_${device_type} info`);
		return results;
	} catch (error) {
		logger.info(`### Failed to fetch all controller_button_type_${device_type} info`);
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.GetControllerButtonTypeListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const getButtonMalfunctionTypeList = async () => {
	let connection;
	let results;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT *
			FROM button_malfunction_type;
		`;
		results = await connection.query(query);
		logger.info(`### Successfully fetched all button_malfunction_type info`);
		return results;
	} catch (error) {
		logger.info(`### Failed to fetch all button_malfunction_type info`);
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.GetButtonMalfunctionTypeListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const insertDevice = async (id, console_id, status) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			INSERT INTO device (id, console_id, status)
			VALUES ('${id}', ${console_id}, '${status}');
		`;
		await connection.query(query);
		logger.info('### INSERT DEVICE SUCCESS');
	} catch (error) {
		logger.info('### INSERT DEVICE FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.InsertDeviceListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const insertMalfunctionType = async (name, description) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			INSERT INTO malfunction_type (name, description)
			VALUES ('${name}', '${description}');
		`;
		await connection.query(query);
		logger.info('### INSERT malfunction_type SUCCESS');
	} catch (error) {
		logger.info('### INSERT malfunction_type FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.InsertMalfunctionTypeListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const insertButtonMalfunctionType = async (name, description) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			INSERT INTO button_malfunction_type (name, description)
			VALUES ('${name}', '${description}');
		`;
		await connection.query(query);
		logger.info('### INSERT button_malfunction_type SUCCESS');
	} catch (error) {
		logger.info('### INSERT button_malfunction_type FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.InsertButtonMalfunctionTypeListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const updateDeviceStatus = async (id, status) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			UPDATE device
			SET status = '${status}'
			WHERE id = '${id}';
		`;
		await connection.query(query);
		logger.info('### UPDATE DEVICE STATUS SUCCESS');
	} catch (error) {
		logger.info('### UPDATE DEVICE STATUS FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.InsertDeviceListError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const isDeviceIdExist = async (id) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT * FROM device
			WHERE id = '${id}';
		`;
		const result = await connection.query(query);
		if (!result.length)
			throw Error();
		logger.info(`### DEVICE ID EXIST`);
	} catch (error) {
		logger.info("### DEVICE ID DOESN'T EXIST");
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.DeviceIdNotExistError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const isControllerButtonTableExist = async (table_name) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT table_name FROM information_schema.tables
			WHERE table_schema = '${process.env.MARIADB_DATABASE}'
			AND table_name = '${'controller_button_type_' + table_name}';
		`;
		const result = await connection.query(query);
		if (!result.length)
			throw Error();
		logger.info(`### ${'controller_button_type_' + table_name} TABLE EXIST`);
	} catch (error) {
		logger.info("### ${'controller_button_type_' + table_name} TABLE DOESN'T EXIST");
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.ControllerButtonTableNotExist('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const deleteDevice = async (id) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			DELETE FROM device
			WHERE id = '${id}';
		`;
		await connection.query(query);
		logger.info('### DELETE DEVICE SUCCESS');
	} catch (error) {
		logger.info('### DELETE DEVICE FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.DeleteDeviceError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

const getDeviceStatus = async (id) => {
	let connection;
	try {
		connection = await mariadbPool.getConnection();
		const query = `
			SELECT status FROM device
			WHERE id = '${id}';
		`;
		const result = await connection.query(query);
		if (!result.length)
			throw Error();
		logger.info('### GET DEVICE STATUS SUCCESS');
		return (result[0].status);
	} catch (error) {
		logger.info('### GET DEVICE STATUS FAIL');
		if (error.code == "ER_GET_CONNECTION_TIMEOUT")
			throw new mariadbException.MariadbConnectionTimeout('In Repository');
		throw new reportGetException.getDeviceStatusError('In Repository');
	} finally {
		if (connection) connection.release();
	}
};

module.exports = {
	getConsoleList,
	getDeviceListByConsoleId,
	getMalfunctionTypeList,
	getControllerButtonTypeList,
	getButtonMalfunctionTypeList,
	insertDevice,
	insertMalfunctionType,
	insertButtonMalfunctionType,
	updateDeviceStatus,
	isDeviceIdExist,
	isControllerButtonTableExist,
	deleteDevice,
	getDeviceStatus
};
