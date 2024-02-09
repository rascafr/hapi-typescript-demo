import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Server } from '@hapi/hapi';
import { name, version } from '../package.json';
import { testHello } from './test';
import { plugin as headerPlugin } from './plugins/header-plugin/headerPlugin';
import { v4 as uuidv4 } from 'uuid';
import sodexoTranslationsPlugin from '@sodexo/hapi-translations-api-wrapper';
import axios from 'axios';

const { NODE_ENV = 'development', CDN_URL } = process.env;

export let server;

export const init = async function () {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: process.env.NODE_HOST || 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async function (request, h) {
      console.log('Got request on /');
      return { name, version, status: 'running', environment: NODE_ENV };
    },
  });

  server.route({
    method: 'GET',
    path: '/boom',
    handler: async function (request, h) {
      const response = (await axios.get('http://www.example.com')).data
        .split('\n')[3]
        .replace(/<\/?title>/g, '')
        .trim();
      console.log('response', response);
      throw Boom.badRequest('Unsupported request from "' + response + '"'); // 400
    },
  });

  if (NODE_ENV === 'production') {
    const msConfig = {
      baseURL: process.env.CMS_API_URL,
      headers: {
        access_token: process.env.CMS_ACCESS_TOKEN,
        api_key: process.env.CMS_API_KEY,
      },
      timeout: +process.env.TIMEOUT_CLIENT || 20000,
    };

    const transverseConfig = {
      baseURL: process.env.CMS_API_URL,
      headers: {
        access_token: process.env.CMS_TRANSVERSE_ACCESS_TOKEN,
        api_key: process.env.CMS_TRANSVERSE_API_KEY,
      },
      timeout: +process.env.TIMEOUT_CLIENT || 20000,
    };

    console.log('Testing Sodexo plugin with', msConfig, transverseConfig);

    const msTranslationClient = axios.create(msConfig);

    const transverseTranslationClient = axios.create(transverseConfig);

    await server.register({
      plugin: sodexoTranslationsPlugin,
      options: {
        clients: {
          ms: msTranslationClient,
          transverse: transverseTranslationClient,
        },
        environment: process.env.CMS_ENVIRONMENT,
        enableLogger: true,
      },
    });
  }

  await server.register({ plugin: headerPlugin, options: { foo: 'bar' } });

  console.log('OK server!', name, '-', version, '(env is', NODE_ENV, ')');
  console.log('Demo', testHello('directory'));
  console.log('CDN_URL is', CDN_URL || 'undefined');

  return server;
};

export const start = async function () {
  console.log(
    `Listening on http://${server.settings.host}:${server.settings.port}`,
    uuidv4()
  );
  return server.start();
};

export const stop = async function () {
  return server.stop();
};

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection');
  console.error(err);
  process.exit(1);
});
