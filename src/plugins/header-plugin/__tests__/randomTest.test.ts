import { v4 as uuidv4 } from 'uuid';

describe('RandomTest example', () => {
  it('Should return a proper uuid-v4 using uuid package', () => {
    expect(uuidv4()).toMatch(/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i);
  });
});
