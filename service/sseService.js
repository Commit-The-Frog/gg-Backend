var logger = require('../config/logger');
var sseException = require('../exception/sseException');
const verifyService = require('../service/verifyService.js');

let listener = [];

/*	[addListener]
	이벤트를 들을 유저를 추가한다.
*/
const addListener = function (id, res, info) {
	try {
		if (!verifyService.isValidId(id))
			throw Error();
		res.header('Content-Type', 'text/event-stream');
		res.header('Cache-Control', 'no-cache');
		res.header('Connection', 'keep-alive');
		id = Date.now() + '.' + id;
		listener.push({id: id, res_id: 1,res: res});
		const data = {
			"action" : "INIT"
		}
		res.write(`id: ${0}\n`);
		res.write('event: INIT\n');
		res.write(`data : ${JSON.stringify(data)}\n\n`);
		logger.info(`### Add ${id} To Listener ${JSON.stringify(data)}`);
		return (id);
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
const sendInfoToListeners = function (action, info) {
	try {
		info.action = action;
		listener.forEach(listener => {
			listener.res.write(`id: ${listener.res_id}\n`);
			listener.res.write(`event: ${action}\n`);
			listener.res.write(`data: ${JSON.stringify(info)}\n\n`);
			listener.res_id += 1;
		});
		logger.info('>>> SSE Speaker Speaks...' + JSON.stringify(info));
	} catch (error) {
		throw new sseException.SseException('from service');
	}
}

module.exports = {
	addListener,
	deleteListener,
	sendInfoToListeners
}
