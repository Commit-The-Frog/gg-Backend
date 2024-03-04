class Exception extends Error {
	constructor(message) {
		super(message);
		this.name = 'Exception';
	}

	// Logger method : must be implemented
	logger() {
		console.log(`[ERROR : ${this.name}] ` + this.message);
	}
}

module.exports = Exception;