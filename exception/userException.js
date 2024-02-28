class UserNameDuplicateError extends Error {
	constructor(message) {
		super(message);
		this.name = "UserNameDuplicateError";
	}
}

class UserNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "UserNotFoundError";
	}
}

module.exports = { 
	UserNameDuplicateError,
	UserNotFoundError
};
	