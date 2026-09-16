import { useEffect, useRef, useState } from 'react';
import { activeSection, sectionProgress, SECTIONS, type SectionKey } from '../animation/scrollConfig';

export interface ScrollState {
  progress: number;
  section: SectionKey;
  sectionProgress: number;
}

export function useScrollProgress(containerRef: React.RefObject<HTMLElement | null>): ScrollState {
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    section: 'hero',
    sectionProgress: 0,
  });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        const progress = max > 0 ? el.scrollTop / max : 0;
        const section = activeSection(progress);
        const sp = sectionProgress(progress, section);
        setState({ progress, section, sectionProgress: sp });
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  return state;
}

/** Scroll the main container to a section by id */
export function scrollToSection(id: string) {
  const container = document.querySelector('.portfolio-scroll') as HTMLElement;
  const target = document.getElementById(id);
  if (container && target) {
    container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }
}

export { SECTIONS };
export type { SectionKey };
