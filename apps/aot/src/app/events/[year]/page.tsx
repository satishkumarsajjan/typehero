import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import { buildMetaForEventPage } from '~/utils/metadata';
import { isValidAdventYear } from '~/utils/time-utils';
import DaySolved from './day';
import type { RouterOutputs } from '~/trpc/react';
import { DailyCountdownTimer } from '~/components/DailyCountdownTimer';
import BgDecorations from './24BgDecorations';
import Partners from '~/components/landing/Partners';
import { Footsies } from '~/components/footsies';
import ChristmasLights from './Lights';

type Challenge = RouterOutputs['event']['getEventChallengesByYear'][0];
interface EventByYearLandingPageProps {
  params: {
    year: string;
  };
}

export function generateMetadata() {
  return buildMetaForEventPage();
}

export default async function EventByYearLandingPage({ params }: EventByYearLandingPageProps) {
  const year = Number(params.year);
  if (!isValidAdventYear(year)) return notFound();

  // this will only return challenges that have passed/currently active
  const activeEventChallenges = await api.event.getEventChallengesByYear({ year });
  const daysThatHavePassed = activeEventChallenges.length;

  const inactiveEventChallenges = Array.from({ length: 25 - daysThatHavePassed }, (_, i) => ({
    day: daysThatHavePassed + i + 1,
    hasSolved: false,
    active: false,
  })) as Challenge[];

  const eventChallenges = [...activeEventChallenges, ...inactiveEventChallenges];
  const groupedDays = groupDays(eventChallenges);

  return (
    <>
      <div className="z-10 -mt-14 flex min-h-screen flex-col items-center justify-between overflow-clip border-b border-neutral-300 bg-gradient-to-t from-neutral-200 to-neutral-50 py-14 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-950">
        <ChristmasLights />
        {/* bg image */}
        <div
          className={`pointer-events-none fixed left-0 top-0 h-full w-full bg-[url('https://images.pexels.com/photos/724906/pexels-photo-724906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover opacity-10 blur-3xl`}
        />
        <div className="container pointer-events-none relative mx-auto pt-12">
          <BgDecorations />

          <ul className="z-10 flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
            {year === 2024 ? (
              <div className="flex flex-col items-center pb-10">
                <DailyCountdownTimer />
              </div>
            ) : (
              <div className="h-12 pb-10" />
            )}
            {groupedDays.map((group, index) => (
              <div key={`row-${index}`} className="flex gap-2 sm:gap-3 md:gap-4">
                {group.map((day) => (
                  <Link
                    key={`day-active-${day.day}`}
                    href={`/events/${year}/${day.day}`}
                    className={!day.active ? 'pointer-events-none' : 'pointer-events-auto'}
                    aria-disabled={!day.active}
                  >
                    <DaySolved day={day.day} active={day.active} hasSolved={day.hasSolved} />
                  </Link>
                ))}
              </div>
            ))}
          </ul>
        </div>
        <div className="mt-20">
          <Partners />
        </div>
      </div>
      <div className="sticky bottom-0 -z-10 w-full">
        <Footsies />
      </div>
    </>
  );
}

function groupDays(array: Challenge[]) {
  const grouped = [];
  let rowSize = 1; // Start with a row size of 1
  let i = 0;

  while (i < array.length) {
    grouped.push(array.slice(i, i + rowSize));
    i += rowSize;
    rowSize++; // Increase row size for the next group
  }

  return grouped;
}
