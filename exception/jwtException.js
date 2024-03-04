const Exception = require('./exception');

class TokenAuthorizeError extends Exception {
	constructor(from) {
		super(from);
		this.name = "TokenAuthorizeError";
		this.status = 402;
		this.logger();
	}
}

class TokenSignError extends Exception {
	constructor(from) {
		super(from);
		this.name = "TokenSignError";
		this.status = 402;
		this.logger();
	}
}

module.exports = {
	TokenAuthorizeError,
	TokenSignError
}
