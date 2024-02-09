const { plugin } = require('../headerPlugin');

describe('HeaderPlugin cute testing', () => {
  it('Should return a proper plugin name', () => {
    expect(typeof plugin.name === 'string').toBe(true);
  });

  it('Should return a proper version', () => {
    expect(plugin.version.split('.').length).toBe(3);
  });
});
