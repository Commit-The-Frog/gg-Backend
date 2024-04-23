const { Report } = require('../config/mongodbConfig');
const {ReportStatus} = require('../config/enum');
const {ObjectId} = require('mongodb');
const { Exception, DefaultException} = require('../exception/exception');

// CREATE report
// status : 0(접수됨) | 1(수리중) | 2(수리완료)
const createReport = async (console_type, device, controller_malf_type,
	controller_malf_btn_list, etc_description) => {
	try {
		const result = await Report.create({
			console_type : console_type,
			device: device,
			controller_malf_type : controller_malf_type,
			controller_malf_btn_list : controller_malf_btn_list,
			etc_description : etc_description,
			status : ReportStatus.REPORTED
		});
		return result;
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

// SEARCH all reports
const searchAllReport = async () => {
	try {
		const result = await Report.find().sort({createAt:-1});
		return result;
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
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
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

// UPDATE report status
const updateReportStatus = async (id, status) => {
	try {
		id = ObjectId.createFromHexString(id);
		const filter = { _id : id };
		const update = { status : status };
		const result = await Report.updateOne(filter, update);
		return result;
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

// DELETE report
const deleteReport = async (id) => {
	try {
		id = ObjectId.createFromHexString(id);
		const result = await Report.deleteOne({ _id : id });
		return result;
	} catch (error) {
		throw (error instanceof Exception ? error : new DefaultException('repository', error.name));
	}
}

module.exports = {
	createReport,
	searchReportById,
	searchAllReport,
	updateReportStatus,
	deleteReport
};