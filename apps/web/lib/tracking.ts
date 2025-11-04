/**
 * Event Tracking for AI Agent Retraining
 * Logs user interactions (clicks, navigation, form submissions) for future ML training
 */

export interface InteractionEvent {
  type: 'click' | 'page_view' | 'form_submit' | 'scroll' | 'input_focus' | 'button_hover';
  element?: string; // CSS selector or element name
  label?: string; // Human-readable label
  value?: string | number; // Optional value (e.g., input length, scroll depth)
  metadata?: Record<string, any>;
}

/**
 * Track a user interaction event
 */
export async function trackInteraction(event: InteractionEvent): Promise<void> {
  try {
    // Don't track if user has opted out of growth tracking
    const optedOut = localStorage.getItem('optedOutGrowth') === 'true';
    if (optedOut) return;

    // Send to tracking API
    await fetch('/api/tracking/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug('Tracking error:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, metadata?: Record<string, any>): void {
  trackInteraction({
    type: 'page_view',
    label: pageName,
    metadata,
  });
}

/**
 * Track button click
 */
export function trackClick(label: string, metadata?: Record<string, any>): void {
  trackInteraction({
    type: 'click',
    label,
    metadata,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, metadata?: Record<string, any>): void {
  trackInteraction({
    type: 'form_submit',
    label: formName,
    metadata,
  });
}

/**
 * Track scroll depth (for engagement metrics)
 */
export function trackScroll(depth: number): void {
  trackInteraction({
    type: 'scroll',
    value: depth,
    label: `${Math.round(depth)}%`,
  });
}

