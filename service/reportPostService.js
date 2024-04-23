const reportPostRepository = require('../repository/reportPostRepository');
const reportGetService = require('./reportGetService');
const {DeviceStatus} = require('../config/enum');
const reportPostException = require('../exception/reportPostException');
const verifyService = require('../service/verifyService');
const verifyException = require('../exception/verifyException');
const {Exception, DefaultException} = require('../exception/exception');

/** 
 * [addReport]
 * -> base64 decode -> JSON parse
 * console_type : 1/2/3
 * device : x/n/p xc1, 2 ...
 * conrtoller_malf_type : button, connect, charge
 * controller_malf_btn_list : [1, unpress], [2, unpress], ...
 * etc_description : not working...
 */
const addReport = async (encodedReq) => {
	try {
		// decode and JSON parse
		const decodedString = Buffer.from(encodedReq, 'base64').toString('utf-8');
		const obj = JSON.parse(decodedString);
		// check required parts
		if (!obj.console_type || !obj.device)
			throw new verifyException.inputFormatError('from service');
		// verify obj
		if (!verifyService.isValidNumber(obj.console_type) ||
			!verifyService.isValidName(obj.device) ||
			(obj.controller_malf_type && !verifyService.isValidName(obj.controller_malf_type)))
			throw new verifyException.inputFormatError('from service');
		// if device is already under repair
		if (obj.device != 'etc' && await reportGetService.getDeviceStatus(obj.device) == DeviceStatus.UNDER_REPAIR)
			throw new reportPostException.DeviceIsUnderRepairError('from service');
		// add report
		return await reportPostRepository.createReport(
			obj.console_type,
			obj.device,
			obj.controller_malf_type,
			obj.controller_malf_btn_list,
			obj.etc_description
		);
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('service', error.name));
	}
}

/**
 * [findAllReport]
 * 전체 접수 목록 조회
 * 최근순으로 정렬
 */
const findAllReport = async () => {
	try {
		const result = await reportPostRepository.searchAllReport();
		return result;
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('service', error.name));
	}
}

/**
 * [changeReportStatus]
 * 신고 상태를 변경
 */
const changeReportStatus = async (id, status) => {
	try {
		// verify id and status
		if (!verifyService.isValidName(id) || 
			!verifyService.isValidNumber(status))
			throw new verifyException.inputFormatError('service');
		// find device by report id
		const report = await reportPostRepository.searchReportById(id);
		if (report === undefined)
			throw new reportPostException.ReportNotFoundError('service');
		// update device status
		await reportGetService.updateDeviceStatus(report.device, status);
		// update report status
		const result = await reportPostRepository.updateReportStatus(id, status);
		if (result.modifiedCount === 0)
			throw new DefaultException('service', 'not modified');
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('service', error.name));
	}
}

/**
 * [removeReport]
 * 신고 삭제
 */
const removeReport = async (id) => {
	try {
		// verify id
		if (!verifyService.isValidName(id))
			throw new verifyException.inputFormatError('service');
		const result = await reportPostRepository.deleteReport(id);
		if (result.deletedCount === 0)
			throw new DefaultException('service', 'not deleted');
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('service', error.name));
	}
}

module.exports = {
	addReport,
	findAllReport,
	changeReportStatus,
	removeReport
};