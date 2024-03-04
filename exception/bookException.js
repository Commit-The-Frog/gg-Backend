const Exception = require('./exception');

class BookTimeConfilctError extends Exception {
	constructor(from) {
		super(from);
		this.name = 'BookTimeConfilctError';
		this.status = 400;
		this.logger();
	}
}

class BookTimeFormatError extends Exception {
	constructor(from) {
		super(from);
		this.name = 'BookTimeFormatError';
		this.staus = 400;
		this.logger();
	}
}

module.exports = {
	BookTimeConfilctError,
	BookTimeFormatError
};