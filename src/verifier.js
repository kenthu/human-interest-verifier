import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://075ffd56f010481db91c9fb856ef73f0@o1029288.ingest.sentry.io/5996228',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

import './verifier.css';
