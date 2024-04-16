const reportPostRepository = require('../repository/reportPostRepository');

/** 
 * []
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

module.exports = {
	addReport
};