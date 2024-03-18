var logger = require('../config/logger');
var sseException = require('../exception/sseException');

let listener = [];

/*	[addListener]
	이벤트를 들을 유저를 추가한다.
*/
const addListener = function (id, res, info) {
	try {
		res.header('Content-Type', 'text/event-stream');
		res.header('Cache-Control', 'no-cache');
		res.header('Connection', 'keep-alive');
		logger.info('### Add ' + id + ' To Listener');
		listener.push({id: id, res: res});
		res.write(`status : subscribe success\n\n`);
	} catch (error) {
		throw new sseException.SseException('from service');
	}
}

/*	[deleteListener]
	id에 해당하는 유저를 구독자에서 삭제한다.
*/
const deleteListener = function (id) {
	try {
		logger.info('### Delete ' + id + ' From Listener');
		listener = listener.filter(client => client.id !== id);
	} catch (error) {
		throw new sseException.SseException('from service');
	}
}

/*	[sendInfoToListeners]
	info를 구독자들 각각에 보낸다.
*/
const sendInfoToListeners = function (info) {
	try {
		logger.info('## SSE Speaker Speaks...');
		listener.forEach(listener => listener.res.write(`data: ${JSON.stringify(info)}\n\n`));
	} catch (error) {
		throw new sseException.SseException('from service');
	}
}

module.exports = {
	addListener,
	deleteListener,
	sendInfoToListeners
}
