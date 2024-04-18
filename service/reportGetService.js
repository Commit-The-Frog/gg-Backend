const logger = require('../config/logger');
const reportGetRepository = require('../repository/reportGetRepository');
const verifyService = require('../service/verifyService.js');
const verifyException = require('../exception/verifyException.js');
const { Exception, DefaultException} = require('../exception/exception');

const getDeviceListByType = async (console_type, device_type) => {
	let deviceList;
	try {
		if (!verifyService.isValidId(console_type) || !verifyService.isValidId(device_type))
			throw new verifyException.inputFormatError('in service');
		deviceList = await reportGetRepository.getDeviceListByConsoleId(console_type, device_type);
		return (deviceList);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
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
		type = type.substring(0, 2);
		btn_list = await reportGetRepository.getControllerButtonTypeList(type);
		btn_malf_type_list = await reportGetRepository.getButtonMalfunctionTypeList();
		return ({
			"controller_malf_type_list" : malf_type_list,
			"controller_btn_list" : btn_list,
			"controller_btn_malf_type_list" : btn_malf_type_list,
		});
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const insertDevice = async (id, console_id, device_type, status) => {
	try {
		if (!verifyService.isValidId(console_id) ||
			!verifyService.isValidName(id) ||
			!verifyService.isValidName(status))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertDevice(id, console_id, device_type, status);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const insertMalfunctionType = async (name, description) => {
	try {
		if (!verifyService.isValidName(name))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertMalfunctionType(name, description);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const insertButtonMalfunctionType = async (name, description) => {
	try {
		if (!verifyService.isValidName(name))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.insertButtonMalfunctionType(name, description);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const updateDeviceStatus = async (id, status) => {
	try {
		if (!verifyService.isValidName(id) ||
			!verifyService.isValidId(status))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.updateDeviceStatus(id, status);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const deleteDevice = async (id) => {
	try {
		if (!verifyService.isValidName(id))
			throw new verifyException.inputFormatError('in service');
		await reportGetRepository.deleteDevice(id);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

const getDeviceStatus = async (id) => {
	try {
		if (!verifyService.isValidName(id))
			throw new verifyException.inputFormatError('in service');
		return (await reportGetRepository.getDeviceStatus(id));
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
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
