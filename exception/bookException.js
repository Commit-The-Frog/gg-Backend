const {Exception} = require('./exception');

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

class BookTimeConflictError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConflictError';
		this.status = 420;
		this.code = 2;
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

class BookNotEnoughRemainSlot extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookNotEnoughRemainSlot';
		this.status = 410;
		this.code = 1;
		this.logger();
	}
}

module.exports = {
	InvalidTypeError,
	BookNotFoundError,
	InvalidTimeError,
	BookTimeConflictError,
	BookTimeFormatError,
	BookNotEnoughRemainSlot
};
