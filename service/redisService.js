const dotenv = require("dotenv").config();
const redis = require('redis');
const access_secret = process.env.JWT_ACCESS_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;

async function createRedisClient() {
    return new Promise((resolve, reject) => {
        const client = redis.createClient({
            socket: {
                port: process.env.REDIS_PORT
            }
        });

        client.on('error', err => {
            console.error('Redis Client Error', err);
            reject(err);
        });

        client.on('connect', () => {
            console.log('Connected to Redis');
            resolve(client);
        }).connect();
    });
}

module.exports = createRedisClient;
