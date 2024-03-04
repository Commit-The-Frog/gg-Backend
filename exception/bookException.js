const Exception = require('./exception');

class BookTimeConfilctError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeConfilctError';
		this.logger();
	}
}

class BookTimeFormatError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'BookTimeFormatError';
		this.logger();
	}
}

module.exports = {
	BookTimeConfilctError,
	BookTimeFormatError
};