let Queue = require('bull')
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

module.exports = (type) => new Queue(type, REDIS_URL)