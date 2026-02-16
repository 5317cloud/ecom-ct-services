import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import fetch from 'node-fetch';

const projectKey = process.env.CT_PROJECT_KEY!;
const clientId = process.env.CT_CLIENT_ID!;
const clientSecret = process.env.CT_CLIENT_SECRET!;
const authUrl = process.env.CT_AUTH_URL!;
const apiUrl = process.env.CT_API_URL!;

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow({
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    fetch,
  })
  .withHttpMiddleware({
    host: apiUrl,
    fetch,
  })
  .withQueueMiddleware({
    concurrency: 5,
  })
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey });
