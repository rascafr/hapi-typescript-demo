import { name, version } from './package.json';

export const plugin = {
  name,
  version,
  register: async (server, options) => {
    console.log('Plugin', name, version, 'registered with', options);
    const appBuildInfo = `${name}-${version}`;
    server.ext('onPreResponse', async (request, handler) => {
      if (appBuildInfo) {
        const { response } = request;
        if (response.isBoom) {
          response.output.headers['x-api-version'] = `boom-${appBuildInfo}`;
        } else {
          response.header('x-api-version', appBuildInfo);
        }
      }
      return handler.continue;
    });
  },
};
