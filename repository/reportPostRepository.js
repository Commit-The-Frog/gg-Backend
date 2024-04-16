const { Report } = require('../config/mongodbConfig');

// CREATE report
const createReport = async (console_type, device, malf_type,
	controller_btn_type, controller_btn_malf_type, etc_description) => {
	const result = await Report.create({
		console_type : console_type,
		device: device,
		malf_type : malf_type,
		controller_btn_type : controller_btn_type,
		controller_btn_malf_type : controller_btn_malf_type,
		etc_description : etc_description
	});
	return result;
}

module.exports = {
	createReport
};