const {Exception} = require('./exception');

class ApiInfoGetError extends Exception {
	constructor(from) {
		super(from);
		this.name = "ApiInfoGetError";
		this.status = 400;
		this.logger();
	}
}
module.exports = {
	ApiInfoGetError
}
