import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ text: 'sample text', level: 'beginner', id: '123' }),
  })
) as jest.Mock;
