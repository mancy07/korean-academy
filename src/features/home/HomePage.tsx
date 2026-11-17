import { Hammer, Pin } from 'lucide-react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useState } from 'react';

// The six stages from the approved curriculum. These are plans, not progress,
// so every ticket says "Planned".
const stages = [
  { number: 0, name: 'Hangul Foundations' },
  { number: 1, name: 'Beginner A' },
  { number: 2, name: 'Beginner B' },
  { number: 3, name: 'Intermediate' },
  { number: 4, name: 'Upper-intermediate' },
  { number: 5, name: 'Advanced' },
];

const ticketColours = ['bg-lilac-200', 'bg-blush-200', 'bg-mint-200'];

type Greeting = { korean: string; english: string };

// Chooses a greeting from the hour of the day (0 to 23). This is the only
// "live" information on the page, and it comes from the device clock.
function getGreeting(hour: number): Greeting {
  if (hour < 12) return { korean: '좋은 아침이에요', english: 'Good morning' };
  if (hour < 18) return { korean: '안녕하세요', english: 'Good afternoon' };
  return { korean: '좋은 저녁이에요', english: 'Good evening' };
}

// Children fade up one after another when the page opens.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
};

export function HomePage() {
  // Read the clock once, so the greeting does not change while the page is open.
  const [now] = useState(() => new Date());
  const greeting = getGreeting(now.getHours());
  const dateLabel = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);

  return (
    <motion.div
      className="mx-auto max-w-5xl px-5 pb-12 pt-8 sm:px-8 md:pt-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item} className="mb-10">
        <p className="font-display text-2xl font-bold text-lilac-700">{dateLabel}</p>
        <h1 className="mt-1 font-display text-5xl font-bold leading-tight text-ink-900 sm:text-6xl">
          <span lang="ko" className="hand-underline">
            {greeting.korean}
          </span>
        </h1>
        <p className="mt-2 max-w-prose text-lg text-ink-700">
          {greeting.english}. Welcome to your study desk.
        </p>
      </motion.header>

      <div className="grid gap-9 md:grid-cols-12">
        <motion.section
          variants={item}
          aria-labelledby="today-heading"
          className="notebook-page pb-9 pl-14 pr-6 pt-11 sm:pr-10 md:col-span-7"
        >
          <span
            aria-hidden="true"
            className="washi washi-lilac absolute -top-3 left-14 h-7 w-32 -rotate-2"
          />
          <div
            aria-hidden="true"
            className="stamp absolute right-4 top-5 grid h-24 w-24 rotate-6 place-items-center text-center font-display font-bold leading-none"
          >
            <span>
              <span lang="ko" className="block text-3xl">
                한글
              </span>
              <span className="block text-base">Hangul</span>
            </span>
          </div>

          <h2 id="today-heading" className="font-display text-3xl font-bold text-ink-900">
            Today&rsquo;s page
          </h2>
          <div className="ruled mt-2 text-lg leading-8 text-ink-700">
            <p>Nothing is planned yet.</p>
            <p>
              Lessons begin with <strong>Stage 0: Hangul Foundations</strong>. Once they
              exist, today&rsquo;s lesson will be written on this page.
            </p>
          </div>
        </motion.section>

        <div className="flex flex-col gap-9 md:col-span-5">
          <motion.section
            variants={item}
            aria-labelledby="reviews-heading"
            className="sticky-note -rotate-2 rounded-sm bg-blush-200 p-6 pt-9"
          >
            <Pin
              aria-hidden="true"
              size={28}
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-blush-600"
            />
            <h2 id="reviews-heading" className="font-display text-2xl font-bold">
              Reviews due
            </h2>
            <p className="mt-2 text-ink-900">
              No review cards exist yet. Cards you study will appear here when they are
              due.
            </p>
          </motion.section>

          <motion.section
            variants={item}
            aria-labelledby="build-heading"
            className="sticky-note ml-4 rotate-1 rounded-sm bg-mint-200 p-6 pt-8"
          >
            <span
              aria-hidden="true"
              className="washi washi-mint absolute -top-3 right-8 h-6 w-20 rotate-3"
            />
            <h2
              id="build-heading"
              className="flex items-center gap-2 font-display text-2xl font-bold"
            >
              <Hammer aria-hidden="true" size={22} />
              Under construction
            </h2>
            <p className="mt-2 text-ink-900">
              This is milestone M0. Only the Desk exists so far. Learn, Practice,
              Dictionary and Me stay greyed out until their modules are built.
            </p>
          </motion.section>
        </div>
      </div>

      <motion.section variants={item} aria-labelledby="road-heading" className="mt-12">
        <div className="flex items-center gap-3">
          <h2 id="road-heading" className="font-display text-3xl font-bold">
            The road ahead
          </h2>
          <span aria-hidden="true" className="washi washi-mint h-6 w-24 rotate-2" />
        </div>
        <p className="mt-1 max-w-prose text-ink-700">
          Six stages, from reading the alphabet to advanced communication. Nothing is
          unlocked yet because no lessons exist yet.
        </p>

        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <li
              key={stage.number}
              className={`flex overflow-hidden rounded-xl bg-cream-50 shadow-paper ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              }`}
            >
              <div
                className={`grid w-20 shrink-0 place-items-center py-3 text-center font-display ${
                  ticketColours[index % ticketColours.length]
                }`}
              >
                <span>
                  <span className="block text-sm font-bold uppercase tracking-wide">
                    Stage
                  </span>
                  <span className="block text-4xl font-bold leading-none">
                    {stage.number}
                  </span>
                </span>
              </div>
              <div className="flex-1 border-l-2 border-dashed border-ink-500/40 px-4 py-3">
                <p className="font-display text-xl font-bold leading-tight">
                  {stage.name}
                </p>
                <p className="mt-1 text-sm text-ink-700">Planned</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>
    </motion.div>
  );
}
