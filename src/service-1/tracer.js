'use strict';
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const {
   BatchSpanProcessor,
   BasicTracerProvider,
} = require('@opentelemetry/sdk-trace-base');
const {
   OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
const { Resource } = require('@opentelemetry/resources');
const {
   SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const {
   ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express');
const {
   MongooseInstrumentation,
} = require('@opentelemetry/instrumentation-mongoose');
// const opentelemetry = require('@opentelemetry/api');
// const {
//    diag,
//    DiagConsoleLogger,
//    DiagLogLevel,
//    trace,
// } = require('@opentelemetry/api');
const {
   RedisInstrumentation,
} = require('@opentelemetry/instrumentation-redis');
const opentelemetry = require('@opentelemetry/api');


// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const setupTracing = (serviceName) => {
   const provider = new NodeTracerProvider({
      resource: new Resource({
         [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
   });

   provider.register();

   const exporter = new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces',
   });

   provider.addSpanProcessor(new BatchSpanProcessor(exporter));

   registerInstrumentations({
      tracerProvider: provider,
      instrumentations: [
         new ExpressInstrumentation(),
         new HttpInstrumentation(),
         new MongooseInstrumentation(),
         new RedisInstrumentation()
      ],
   });

   console.log('Tracing initialized');

   return opentelemetry.trace.getTracer(serviceName);
};

module.exports = { setupTracing };

// trace.getTracer('test').startSpan('test span').end();
