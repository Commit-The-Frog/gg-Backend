var logger = require('../config/logger');

const isValidId = function (input) {
	if (!(input instanceof String))
		input = input.toString();
	const pattern = /^\d+$/;
	const result = pattern.test(input);
	logger.info("### isValidId Result " + result);
	return (result);
}

const isValidName = function (input) {
	if (!(input instanceof String))
		input = input.toString();
	const pattern = /^[a-zA-Z0-9-]+$/;
	const result = pattern.test(input);
	logger.info("### IsValidName Result " + result);
	return (result);
}

const isValidDate = function (input) {
	if (!(input instanceof String))
		input = input.toString();
	const pattern = /^\d{4}-\d{2}-\d{2}$/;
	const result = pattern.test(input);
	logger.info("### IsValidDate Result " + result);
	return (result);
}

const isValidNumber = function (input) {
	if (!(input instanceof String))
		input = input.toString();
	const pattern = /^\d+$/;
	const result = pattern.test(input);
	logger.info("### IsValidNumber Result " + result);
	return (result);
}

const isValidTokenStruct = function (input) {
	if (!(input instanceof String))
		input = input.toString();
	const pattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/;
	const result = pattern.test(input);
	logger.info("### IsValidTokenStruct Result " + result);
	return (result);
}

module.exports = {
	isValidId,
	isValidName,
	isValidDate,
	isValidNumber,
	isValidTokenStruct
}
