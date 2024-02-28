class UserNameDuplicateError extends Error {
	constructor(message) {
		super(message);
		this.name = "UserNameDuplicateError";
	}
}

module.exports = UserNameDuplicateError;
	