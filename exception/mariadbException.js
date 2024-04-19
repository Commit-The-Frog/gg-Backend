const {Exception} = require('./exception');

class MariadbConnectionTimeout extends Exception {
	constructor(message) {
		super(message);
		this.name = 'MariadbConnectionTimeout';
		this.status = 500;
		this.logger();
	}
};

class MariadbDupEntryError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'MariadbDupEntryError';
		this.status = 400;
		this.logger();
	}
};

class MariadbZeroRowAffected extends Exception {
	constructor(message) {
		super(message);
		this.name = 'MariadbZeroRowAffected';
		this.status = 400;
		this.logger();
	}
};

module.exports = {
	MariadbConnectionTimeout,
	MariadbDupEntryError,
	MariadbZeroRowAffected
};
