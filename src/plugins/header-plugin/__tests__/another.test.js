import someMock from './mock/test.mock.json';

describe('Another cute test', () => {
  it('Should read json without issues', () => {
    expect(someMock).toEqual({ newCardStatus: 'U' });
  });
});
