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

class GetMalfunctionTypeListError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'GetMalfunctionTypeListError';
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


module.exports = {
	GetConsoleListError,
	GetDeviceListError,
	GetMalfunctionTypeListError,
	GetControllerButtonTypeListError,
	GetButtonMalfunctionTypeListError
};
