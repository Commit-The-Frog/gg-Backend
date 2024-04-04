const dotenv = require("dotenv").config();
const redis = require('redis');
const logger = require('../config/logger');

async function createRedisClient() {
    return new Promise((resolve, reject) => {
        const client = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST,
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
