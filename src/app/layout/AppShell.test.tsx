import { fireEvent, render, screen, within } from '@testing-library/react';
import { MotionConfig } from 'motion/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { routes } from '@/app/router';

// jsdom (the fake browser used in tests) has no matchMedia, so we provide a
// minimal one that always answers "no".
beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
});

// Renders the real route table at a URL, with motion switched off so
// the tests do not depend on animation timing.
function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <MotionConfig reducedMotion="always">
      <RouterProvider router={router} />
    </MotionConfig>,
  );
  return router;
}

describe('AppShell', () => {
  it('shows the Desk home screen inside the shell', () => {
    renderAt('/');

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /today/i })).toBeInTheDocument();
  });

  it('lists the five navigation items in order', () => {
    renderAt('/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    const labels = ['Desk', 'Learn', 'Practice', 'Dictionary', 'Me'];
    const found = within(nav)
      .getAllByRole('listitem')
      .map((li) => labels.find((label) => li.textContent?.startsWith(label)));

    expect(found).toEqual(labels);
  });

  it('marks the Desk as the current page', () => {
    renderAt('/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Desk' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('shows unbuilt destinations as disabled buttons, not links', () => {
    renderAt('/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getAllByRole('link')).toHaveLength(1);

    for (const label of ['Learn', 'Practice', 'Dictionary', 'Me']) {
      const button = within(nav).getByRole('button', {
        name: new RegExp(`^${label}`),
      });
      expect(button).toBeDisabled();
    }
  });

  it('does not navigate when an unavailable item is clicked', () => {
    const router = renderAt('/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    fireEvent.click(within(nav).getByRole('button', { name: /^Learn/ }));

    expect(router.state.location.pathname).toBe('/');
  });

  it('has a skip link that points at the main region', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('does not show study statistics before any exist', () => {
    renderAt('/');

    expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no review cards exist yet/i)).toBeInTheDocument();
  });

  it('shows a not-found page, still inside the shell, for unknown URLs', () => {
    renderAt('/does-not-exist');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });
});
