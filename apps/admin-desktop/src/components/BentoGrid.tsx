import type { PropsWithChildren } from 'react';

export function BentoGrid({ children }: PropsWithChildren) {
  return <div className="grid gap-5 xl:grid-cols-12">{children}</div>;
}
