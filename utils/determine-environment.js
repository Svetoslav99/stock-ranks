const devEnv = process.env.environment !== 'production';
const hostAddr = devEnv ? 'http://localhost:3000' : 'https://stock-ranks.com';

module.exports = hostAddr;
