const logger = require('../config/logger');
const reportGetRepository = require('../repository/reportGetRepository');
const verifyService = require('../service/verifyService.js');
const verifyException = require('../exception/verifyException.js');

const getDeviceListByType = async (type) => {
	let deviceList;
	try {
		if (!verifyService.isValidId(type))
			throw new verifyException.inputFormatError('in service');
		deviceList = await reportGetRepository.getDeviceListByConsoleId(type);
	} catch (error) {
		throw error;
	} finally {
		return ({
			"devices" : deviceList
		});
	}
}

const getMultipleListByControllerType = async (type) => {
	let malf_type_list;
	let btn_list;
	let btn_malf_type_list;
	try {
		malf_type_list = await reportGetRepository.getMalfunctionTypeList();
		type = type.substring(0, 2);
		btn_list = await reportGetRepository.getControllerButtonTypeList(type);
		btn_malf_type_list = await reportGetRepository.getButtonMalfunctionTypeList();
	} catch (error) {
		throw error;
	} finally {
		return ({
			"malf_type_list" : malf_type_list,
			"btn_list" : btn_list,
			"btn_malf_type_list" : btn_malf_type_list,
		});
	}
}

module.exports = {
	getDeviceListByType,
	getMultipleListByControllerType
}
