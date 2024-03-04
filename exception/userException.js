const Exception = require('./exception');

class UserNameDuplicateError extends Exception {
	constructor(message) {
		super(message);
		this.name = "UserNameDuplicateError";
		this.logger();
	}
}

class UserNotFoundError extends Exception {
	constructor(message) {
		super(message);
		this.name = "UserNotFoundError";
		this.logger();
	}
}

module.exports = { 
	UserNameDuplicateError,
	UserNotFoundError
};
	