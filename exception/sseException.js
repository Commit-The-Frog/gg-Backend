const Exception = require('./exception');

class SseException extends Exception {
	constructor(from) {
		super(from);
		this.name = "SseError";
		this.status = 500;
		this.logger();
	}
}

module.exports = {
	SseException
};
