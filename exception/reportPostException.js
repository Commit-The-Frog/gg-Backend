const Exception = require('./exception');

class DeviceIsUnderRepairError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'DeviceIsUnderRepairError';
		this.status = 400;
		this.logger();
	}
}

module.exports = {
	DeviceIsUnderRepairError,
	
}