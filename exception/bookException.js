const Exception = require('./exception');

class InvalidTypeError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'InvalidTypeError';
		this.status = 400;
		this.logger();
	}
};

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
		this.name = 'BookNotFoundError';
		this.status = 400;
		this.logger();
	}
};

class BookTimeConfilctError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConfilctError';
		this.status = 400;
		this.logger();
	}
};

class BookTimeFormatError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeFormatError';
		this.status = 400;
		this.logger();
	}
};

module.exports = {
	InvalidTypeError,
	BookNotFoundError,
	InvalidTimeError,
	BookTimeConfilctError,
	BookTimeFormatError
};