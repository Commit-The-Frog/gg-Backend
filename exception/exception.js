const logger = require('../config/logger');

class Exception extends Error {
	constructor(message) {
		super(message);
		this.message = message;
		this.name = 'Exception';
		this.status = 400;
	}

	// Logger method : must be implemented
	logger() {
		logger.info(`### [ERROR : ${this.name}] ` + this.message);
	}
}

class DefaultException extends Exception {
	constructor(message, name) {
		super(message);
		this.name = name;
		this.status = 400;
		this.logger();
	}
}

module.exports = {
	Exception,
	DefaultException
}
