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
		return ({
			"devices" : deviceList
		});
	} catch (error) {
		throw error;
	}
}

const getMultipleListByControllerType = async (type) => {
	let malf_type_list;
	let btn_list;
	let btn_malf_type_list;
	try {
		malf_type_list = await reportGetRepository.getMalfunctionTypeList();
		if (!verifyService.isValidName(type))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.isDeviceIdExist(type);
		type = type.substring(0, 2);
		await reportGetRepository.isControllerButtonTableExist(type);
		btn_list = await reportGetRepository.getControllerButtonTypeList(type);
		btn_malf_type_list = await reportGetRepository.getButtonMalfunctionTypeList();
		return ({
			"malf_type_list" : malf_type_list,
			"btn_list" : btn_list,
			"btn_malf_type_list" : btn_malf_type_list,
		});
	} catch (error) {
		throw error;
	}
}

const insertDevice = async (id, console_id, status) => {
	try {
		if (!verifyService.isValidId(console_id) ||
			!verifyService.isValidName(id) ||
			!verifyService.isValidName(status))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertDevice(id, console_id, status);
	} catch (error) {
		throw error;
	}
}

const insertMalfunctionType = async (name, description) => {
	try {
		if (!verifyService.isValidName(name))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertMalfunctionType(name, description);
	} catch (error) {
		throw error;
	}
}

const insertButtonMalfunctionType = async (name, description) => {
	try {
		if (!verifyService.isValidName(name))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertButtonMalfunctionType(name, description);
	} catch (error) {
		throw error;
	}
}

const updateDeviceStatus = async (id, status) => {
	try {
		if (!verifyService.isValidName(id) ||
			!verifyService.isValidId(status))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.isDeviceIdExist(id);
		await reportGetRepository.updateDeviceStatus(id, status);
	} catch (error) {
		throw error;
	}
}

const deleteDevice = async (id) => {
	try {
		if (!verifyService.isValidName(id))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.isDeviceIdExist(id);
		await reportGetRepository.deleteDevice(id);
	} catch (error) {
		throw error;
	}
}

const getDeviceStatus = async (id) => {
	try {
		if (!verifyService.isValidName(id))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.isDeviceIdExist(id);
		return (await reportGetRepository.getDeviceStatus(id));
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getDeviceListByType,
	getMultipleListByControllerType,
	insertDevice,
	insertMalfunctionType,
	insertButtonMalfunctionType,
	updateDeviceStatus,
	deleteDevice,
	getDeviceStatus
}
