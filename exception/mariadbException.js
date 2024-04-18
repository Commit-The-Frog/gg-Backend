const {Exception} = require('./exception');

class MariadbConnectionTimeout extends Exception {
	constructor(message) {
		super(message);
		this.name = 'MariadbConnectionTimeout';
		this.status = 500;
		this.logger();
	}
};

module.exports = {
	MariadbConnectionTimeout
};
