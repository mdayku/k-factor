/**
 * React Hook for Event Tracking
 * Makes it easy to track user interactions in components
 */

import { useEffect, useCallback } from 'react';
import { trackPageView, trackClick, trackFormSubmit, trackInteraction, InteractionEvent } from '../lib/tracking';

export function useTracking(pageName?: string) {
  // Track page view on mount
  useEffect(() => {
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName]);

  // Track click event
  const trackClickEvent = useCallback((label: string, metadata?: Record<string, any>) => {
    trackClick(label, metadata);
  }, []);

  // Track form submission
  const trackFormSubmitEvent = useCallback((formName: string, metadata?: Record<string, any>) => {
    trackFormSubmit(formName, metadata);
  }, []);

  // Track custom interaction
  const track = useCallback((event: InteractionEvent) => {
    trackInteraction(event);
  }, []);

  return {
    trackClick: trackClickEvent,
    trackFormSubmit: trackFormSubmitEvent,
    track,
  };
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollTracking(threshold: number = 75) {
  useEffect(() => {
    let tracked = false;

    const handleScroll = () => {
      if (tracked) return;

      const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      if (scrollDepth >= threshold) {
        trackInteraction({
          type: 'scroll',
          value: Math.round(scrollDepth),
          label: `Scrolled ${threshold}%`,
        });
        tracked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
}

