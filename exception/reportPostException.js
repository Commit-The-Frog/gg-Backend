const {Exception} = require('./exception');

class DeviceIsUnderRepairError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'DeviceIsUnderRepairError';
		this.status = 400;
		this.logger();
	}
}

class ReportNotFoundError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'ReportNotFoundError';
		this.status = 404;
		this.logger();
	}
}

module.exports = {
	DeviceIsUnderRepairError,
	ReportNotFoundError
}