const Exception = require('./exception');

class BookTimeConfilctError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConfilctError';
		this.status = 400;
		this.logger();
	}
}

class BookTimeFormatError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeFormatError';
		this.staus = 400;
		this.logger();
	}
}

module.exports = {
	BookTimeConfilctError,
	BookTimeFormatError
};