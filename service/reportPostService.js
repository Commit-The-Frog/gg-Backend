const reportPostRepository = require('../repository/reportPostRepository');
const reportGetService = require('./reportGetService');
const {DeviceStatus} = require('../config/enum');
const { error } = require('winston');

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
		const decodedString = Buffer.from(encodedReq, 'base64').toString('utf-8');
		const obj = JSON.parse(decodedString);
		await reportGetService.updateDeviceStatus(obj.device, DeviceStatus.MALFUNCTION);
		console.log('decoding & json parsing success');
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
		console.log ('[SERVICE] all reports searched');
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
		const report = reportPostRepository.findReportById(id);
		// update device status
		reportGetService.updateDeviceStatus(report.device, status);
		// update report status
		const result = await reportPostRepository.updateReportStatus(id, status);
		if (result.modifiedCount === 0)
			throw error;
		console.log('[SERVICE] updated status');
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
		console.log(result);
		if (result.deletedCount === 0)
			throw error;
		console.log('[SERVICE] deleted status');
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