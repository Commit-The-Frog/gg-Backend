const reportPostRepository = require('../repository/reportPostRepository');

/** 
 * []
 */
const addReport = async (encodedReq) => {
	// first, let's decode controller_btn_malf_list
	const decodedString = Buffer.from(encodedReq, 'base64').toString('utf-8');
	console.log(decodedString);
	return decodedString;
}

module.exports = {
	addReport
};