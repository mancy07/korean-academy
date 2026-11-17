import { BookOpen, GraduationCap, NotebookPen, Pencil, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

type NavItem = {
  label: string;
  icon: LucideIcon;
  // Set only when the destination really exists. An item without `to`
  // is shown greyed out and cannot be opened.
  to?: string;
};

const navItems: NavItem[] = [
  { label: 'Desk', icon: NotebookPen, to: '/' },
  { label: 'Learn', icon: GraduationCap },
  { label: 'Practice', icon: Pencil },
  { label: 'Dictionary', icon: BookOpen },
  { label: 'Me', icon: User },
];

// Tiny helper that joins class names and skips false/undefined values.
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// Shared by links and disabled buttons. Mobile: icon above label.
// Desktop (md and up): icon beside label, shaped like an index tab.
// Text colour is set by each state below, never here, so classes never compete.
const itemBase =
  'relative flex w-full flex-col items-center gap-0.5 px-1 py-2 text-xs font-semibold ' +
  'transition-colors motion-reduce:transition-none ' +
  'md:flex-row md:gap-3 md:rounded-l-3xl md:px-5 md:py-3 md:font-display md:text-2xl md:font-bold';
const itemIdle = 'text-ink-700 hover:text-lilac-700 md:hover:bg-lilac-100';
const itemActive = 'text-lilac-700 md:bg-cream-50 md:shadow-paper';
const itemDisabled = 'cursor-not-allowed text-ink-500 opacity-80';

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* One navigation element for every screen size. CSS turns it into a
          bottom bar on phones and a notebook-spine sidebar on desktop. */}
      <nav
        aria-label="Main"
        className="spine fixed inset-x-0 bottom-0 z-30 border-t-2 border-dashed border-lilac-300 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:inset-x-auto md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-t-0 md:bg-lilac-200 md:pb-0 md:backdrop-blur-none"
      >
        <div className="relative hidden pb-6 pl-12 pr-4 pt-10 md:block">
          <span
            aria-hidden="true"
            className="washi absolute -top-2 left-14 h-6 w-24 -rotate-3"
          />
          <p className="font-display leading-none text-lilac-700">
            <span lang="ko" className="block text-6xl font-bold">
              한글
            </span>
            <span className="mt-1 block text-2xl font-bold">Korean Academy</span>
          </p>
        </div>

        <ul className="flex md:flex-col md:gap-2 md:py-2 md:pl-12">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label} className="flex-1 md:flex-none">
                {item.to ? (
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cx(itemBase, isActive ? itemActive : itemIdle)
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cx(
                            'grid h-8 w-14 place-items-center rounded-full transition-colors motion-reduce:transition-none md:h-auto md:w-auto md:rounded-none',
                            isActive && 'bg-blush-200 md:bg-transparent',
                          )}
                        >
                          <Icon size={22} aria-hidden="true" />
                        </span>
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ) : (
                  // Not built yet: a real button that does nothing, announced
                  // to screen readers as unavailable. No placeholder page.
                  <button type="button" disabled className={cx(itemBase, itemDisabled)}>
                    <span className="grid h-8 w-14 place-items-center md:h-auto md:w-auto">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span>{item.label}</span>
                    <span className="sr-only">, not available yet</span>
                    <span
                      aria-hidden="true"
                      className="ml-auto mr-4 hidden rounded-full bg-cream-50/80 px-2 py-0.5 font-body text-xs font-semibold md:inline"
                    >
                      soon
                    </span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-auto hidden px-6 pb-6 pl-12 text-sm text-ink-700 md:block">
          Free to use. No ads, no accounts.
        </p>
      </nav>

      <main
        id="main"
        tabIndex={-1}
        className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-64"
      >
        <Outlet />
      </main>
    </div>
  );
}
