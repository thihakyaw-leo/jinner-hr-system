import { useState } from 'react';

export function useActiveTab<T extends string>(initialValue: T) {
  return useState<T>(initialValue);
}
