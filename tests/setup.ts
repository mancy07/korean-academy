import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount any React components rendered during a test, so tests stay independent.
afterEach(() => {
  cleanup();
});
