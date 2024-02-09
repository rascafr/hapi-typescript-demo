import { join } from 'path';

export function testHello(xxx) {
  return join(__dirname, xxx);
}
