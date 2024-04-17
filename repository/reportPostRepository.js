const { Report } = require('../config/mongodbConfig');

// CREATE report
// status : 0(접수됨) | 1(수리중) | 2(수리완료)
const createReport = async (console_type, device, malf_type,
	controller_btn_malf_list, etc_description) => {
	try {
		const result = await Report.create({
			console_type : console_type,
			device: device,
			malf_type : malf_type,
			controller_btn_malf_list : controller_btn_malf_list,
			etc_description : etc_description,
			status : 0
		});
		console.log('db insert success');
		return result;
	} catch (error) {
		throw error;
	}
}

// SEARCH report
const searchAllReport = async () => {
	try {
		const result = await Report.find().sort({createAt:-1});
		console.log('[REPO] all reports searched');
		return result;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createReport,
	searchAllReport
};