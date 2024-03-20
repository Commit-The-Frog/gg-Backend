const Exception = require('./exception');

class inputFormatError extends Exception {
	constructor(from) {
		super(from);
		this.name = "inputFormatError";
		this.status = 400;
		this.logger();
	}
}
module.exports = {
	inputFormatError
}
