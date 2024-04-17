const Exception = require('./exception');

class GetConsoleListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetConsoleListError';
		this.status = 500;
		this.logger();
	}
};

class GetDeviceListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetDeviceListError';
		this.status = 500;
		this.logger();
	}
};

class InsertDeviceListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InsertDeviceListError';
		this.status = 500;
		this.logger();
	}
};

class GetMalfunctionTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetMalfunctionTypeListError';
		this.status = 500;
		this.logger();
	}
};

class InsertMalfunctionTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InsertMalfunctionTypeListError';
		this.status = 500;
		this.logger();
	}
};

class GetControllerButtonTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetControllerButtonTypeListError';
		this.status = 500;
		this.logger();
	}
};

class GetButtonMalfunctionTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetButtonMalfunctionTypeListError';
		this.status = 500;
		this.logger();
	}
};

class InsertButtonMalfunctionTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InsertButtonMalfunctionTypeListError';
		this.status = 500;
		this.logger();
	}
};

class DeviceIdNotExistError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'DeviceIdNotExistError';
		this.status = 400;
		this.logger();
	}
};

class ControllerButtonTableNotExist extends Exception {
	constructor(message) {
		super(message);
		this.name = 'ControllerButtonTableNotExist';
		this.status = 400;
		this.logger();
	}
};

class DeleteDeviceError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'DeleteDeviceError';
		this.status = 400;
		this.logger();
	}
};

class getDeviceStatusError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'getDeviceStatusError';
		this.status = 400;
		this.logger();
	}
};

module.exports = {
	GetConsoleListError,
	GetDeviceListError,
	InsertDeviceListError,
	GetMalfunctionTypeListError,
	InsertMalfunctionTypeListError,
	GetControllerButtonTypeListError,
	GetButtonMalfunctionTypeListError,
	InsertButtonMalfunctionTypeListError,
	DeviceIdNotExistError,
	ControllerButtonTableNotExist,
	DeleteDeviceError
};
