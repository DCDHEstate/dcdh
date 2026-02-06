'use client';

import useScrollReveal from '@/hooks/useScrollReveal';

export default function ScrollRevealProvider({ children }) {
  useScrollReveal();
  return children;
}
