const {Exception} = require('./exception');

class ApiInfoGetError extends Exception {
	constructor(message) {
		super(message);
		this.name = "ApiInfoGetError";
		this.status = 400;
		this.logger();
	}
}

class NotAdminUserError extends Exception {
	constructor(message) {
		super(message);
		this.name = 'NotAdminUserError';
		this.status = 401;
		this.logger();
	}
}

module.exports = {
	ApiInfoGetError,
	NotAdminUserError
}
