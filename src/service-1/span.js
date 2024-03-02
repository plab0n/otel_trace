const { setupTracing } = require('./tracer');

const tracer = setupTracing('main-trace');

module.exports = { tracer };
