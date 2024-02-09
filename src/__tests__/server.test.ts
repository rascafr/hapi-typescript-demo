import axios from 'axios';
import { init, start, stop } from '../server';
import nock from 'nock';

describe('Server Testing', () => {
  let server = null;

  beforeAll(async () => {
    server = await init();
    await start();
    if (!nock.isActive()) {
      nock.activate();
    }
    console.log('🟢 Test server is running');
  });

  afterAll(async () => {
    await stop();
    nock.cleanAll();
    console.log('🔴 Test server is stopped');
  });

  it('Should echo a response', async () => {
    const data = (await axios.get('http://localhost:4000')).data;
    expect(data).toEqual({
      name: 'hapi-es6',
      version: '1.0.0',
      status: 'running',
      environment: 'test',
    });
  });
});
