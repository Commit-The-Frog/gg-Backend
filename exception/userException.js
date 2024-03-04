const Exception = require('./exception');

class UserNameDuplicateError extends Exception {
	constructor(from) {
		super(from);
		this.name = "UserNameDuplicateError";
		this.status = 400;
		this.logger();
	}
}

class UserNotFoundError extends Exception {
	constructor(from) {
		super(from);
		this.name = "UserNotFoundError";
		this.status = 404;
		this.logger();
	}
}

module.exports = { 
	UserNameDuplicateError,
	UserNotFoundError
};
	