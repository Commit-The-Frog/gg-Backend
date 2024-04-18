const {Exception} = require('./exception');

class TokenAuthorizeError extends Exception {
	constructor(from) {
		super(from);
		this.name = "TokenAuthorizeError";
		this.status = 401;
		this.logger();
	}
}

class TokenSignError extends Exception {
	constructor(from) {
		super(from);
		this.name = "TokenSignError";
		this.status = 500;
		this.logger();
	}
}

class LogoutError extends Exception {
	constructor(from) {
		super(from);
		this.name = "LogoutError";
		this.status = 500;
		this.logger();
	}
}

module.exports = {
	TokenAuthorizeError,
	TokenSignError,
	LogoutError
}
