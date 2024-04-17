const reportPostRepository = require('../repository/reportPostRepository');
const reportGetService = require('./reportGetService');
const {DeviceStatus} = require('../config/enum');
const { error } = require('winston');
const reportPostException = require('../exception/reportPostException');

/** 
 * [addReport]
 * -> base64 decode -> JSON parse
 * console_type : xbox/nintendo/ps5
 * device : x/n/p xc1, 2 ...
 * malf_type : button, connect, charge
 * controller_btn_malf_list : [1, unpress], [2, unpress], ...
 * etc_description : not working...
 */
const addReport = async (encodedReq) => {
	try {
		// decode and JSON parse
		const decodedString = Buffer.from(encodedReq, 'base64').toString('utf-8');
		const obj = JSON.parse(decodedString);
		// if device is already under repair
		if (await reportGetService.getDeviceStatus(obj.device) != DeviceStatus.NORMAL)
			throw new reportPostException.DeviceIsUnderRepairError('from service');
		// update device status
		await reportGetService.updateDeviceStatus(obj.device, DeviceStatus.MALFUNCTION);
		// add report
		return await reportPostRepository.createReport(
			obj.console_type,
			obj.device,
			obj.malf_type,
			obj.controller_btn_malf_list,
			obj.etc_description
		);
	} catch (error) {
		throw error;
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
		throw error;
	}
}

/**
 * [changeReportStatus]
 * 신고 상태를 변경
 */
const changeReportStatus = async (id, status) => {
	try {
		// find device by report id
		const report = await reportPostRepository.searchReportById(id);
		if (!report)
			throw new reportPostException.ReportNotFoundError('from service');
		// update device status
		await reportGetService.updateDeviceStatus(report.device, status);
		// update report status
		const result = await reportPostRepository.updateReportStatus(id, status);
		if (result.modifiedCount === 0)
			throw Exception;
	} catch (error) {
		throw error;
	}
}

/**
 * [removeReport]
 * 신고 삭제
 */
const removeReport = async (id) => {
	try {
		const result = await reportPostRepository.deleteReport(id);
		if (result.deletedCount === 0)
			throw Exception;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	addReport,
	findAllReport,
	changeReportStatus,
	removeReport
};