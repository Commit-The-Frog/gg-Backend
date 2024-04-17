const reportPostRepository = require('../repository/reportPostRepository');

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
		console.log('decoding & json parsing success');
		console.log(obj);
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

module.exports = {
	addReport,
	findAllReport
};