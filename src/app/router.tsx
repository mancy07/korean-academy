import { createBrowserRouter, Link } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';

// Only routes that really exist are listed. Each module adds its own
// routes in the milestone that builds it.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export function createAppRouter() {
  // BASE_URL is "/" for now. It lets us host under a sub-path later
  // (for example GitHub Pages at /korean-academy/) without changing code.
  return createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-5xl font-bold text-lilac-700">Page not found</h1>
      <p className="mt-4 text-lg text-ink-700">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-lilac-200 px-5 py-2 font-semibold text-lilac-700 hover:bg-lilac-300"
      >
        Back to your desk
      </Link>
    </div>
  );
}
