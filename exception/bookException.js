const Exception = require('./exception');

class InvalidTypeError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InvalidTypeError';
		this.status = 400;
		this.logger();
	}
}

class InvalidTimeError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InvalidTimeError';
		this.status = 400;
		this.logger();
	}
}

class BookNotFoundError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConfilctError';
		this.status = 400;
		this.logger();
	}
}

class BookTimeConfilctError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConfilctError';
		this.status = 400;
		this.logger();
	}
}

module.exports = {
	InvalidTypeError,
	InvalidTimeError,
	BookNotFoundError,
	BookTimeConfilctError
};