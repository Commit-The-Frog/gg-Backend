class Exception extends Error {
	constructor(from) {
		super(from);
		this.name = 'Exception';
		this.status = 400;
	}

	// Logger method : must be implemented
	logger() {
		console.log(`[ERROR : ${this.name}] ` + this.from);
	}
}

module.exports = Exception;