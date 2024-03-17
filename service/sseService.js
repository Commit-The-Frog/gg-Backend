var logger = require('../config/logger');

let listener = [];

const addListener = function (id, res) {
	res.header('Content-Type', 'text/event-stream');
	res.header('Cache-Control', 'no-cache');
	res.header('Connection', 'keep-alive');
	logger.info('### Add ' + id + ' To Listener');
	listener.push({id: id, res: res});
}

const deleteListener = function (id) {
	logger.info('### Delete ' + id + ' From Listener');
	listener = listener.filter(client => client.id !== id);
}

const sendInfoToListeners = function (info) {
	listener.forEach(listener => listener.res.write('data: ${JSON.stringify(info)}\n\n'));
}
