let Queue = require('bull')
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

module.exports = () => new Queue('work', REDIS_URL)