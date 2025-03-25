'use client';

import { usePathname } from 'next/navigation';
import { useFullscreenSettingsStore } from '~/app/events/[year]/[day]/fullscreen-button';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { fssettings } = useFullscreenSettingsStore();
  const pathname = usePathname();

  if (fssettings.isFullscreen) return <></>;

  return (
    <nav
      className={`flex h-14 items-center ${
        pathname?.includes('2023/') || pathname?.includes('2024/') ? 'px-4' : 'container'
      }`}
    >
      {children}
    </nav>
  );
}
