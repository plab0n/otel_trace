/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'adderservice',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  //Note: Only require for auto instrumentation
  //instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
