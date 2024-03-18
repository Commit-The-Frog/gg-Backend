const dotenv = require("dotenv").config();
const redis = require('redis');
var logger = require('../config/logger');

async function createRedisClient() {
    return new Promise((resolve, reject) => {
        const client = redis.createClient({
            socket: {
                port: process.env.REDIS_PORT
            }
        });

        client.on('error', err => {
            console.error('### Redis Client Error', err);
            reject(err);
        });

        client.on('connect', () => {
            logger.info('### Connected to Redis');
            resolve(client);
        }).connect();
    });
}

module.exports = createRedisClient;
