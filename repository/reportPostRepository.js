const { Report } = require('../config/mongodbConfig');
const {ReportStatus} = require('../config/enum');
const {ObjectId} = require('mongodb');

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
			status : ReportStatus.REPORTED
		});
		return result;
	} catch (error) {
		throw error;
	}
}

// SEARCH all reports
const searchAllReport = async () => {
	try {
		const result = await Report.find().sort({createAt:-1});
		return result;
	} catch (error) {
		throw error;
	}
}

// SERACH report by id
const searchReportById = async (id) => {
	try {
		id = ObjectId.createFromHexString(id);
		const result = await Report.findOne({
			_id : id
		});
		return result;
	} catch (error) {
		throw error;
	}
}

// UPDATE report status
const updateReportStatus = async (id, status) => {
	try {
		id = ObjectId.createFromHexString(id);
		const filter = { _id : id };
		const update = { status : status };
		const result = await Report.updateOne(filter, update);
		console.log('[REPO] updated status');
		return result;
	} catch (error) {
		throw error;
	}
}

// DELETE report
const deleteReport = async (id) => {
	try {
		id = ObjectId.createFromHexString(id);
		const result = await Report.deleteOne({ _id : id });
		console.log('[REPO] deleted status');
		return result;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createReport,
	searchReportById,
	searchAllReport,
	updateReportStatus,
	deleteReport
};