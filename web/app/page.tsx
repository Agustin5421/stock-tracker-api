'use client';

import { AppProvider } from '@/lib/app-context';
import { App } from '@/components/app';

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
