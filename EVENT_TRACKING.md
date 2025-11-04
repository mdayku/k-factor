# Event Tracking System for AI Retraining

## Overview

The event tracking system logs user interactions (clicks, page views, form submissions, scrolling) to the database for future AI agent retraining. This data helps improve personalization, viral loop optimization, and user experience.

## Architecture

### 1. Client-Side Tracking (`apps/web/lib/tracking.ts`)

Lightweight utility functions for tracking interactions:
- `trackPageView(pageName, metadata)` - Log page visits
- `trackClick(label, metadata)` - Log button/link clicks  
- `trackFormSubmit(formName, metadata)` - Log form submissions
- `trackScroll(depth)` - Log scroll engagement
- `trackInteraction(event)` - Generic event tracker

**Privacy:** Automatically respects user's `optedOutGrowth` localStorage flag.

### 2. React Hooks (`apps/web/hooks/useTracking.ts`)

Easy-to-use hooks for React components:

```typescript
// Page tracking + utilities
const { trackClick, trackFormSubmit, track } = useTracking("Page Name");

// Scroll depth tracking
useScrollTracking(75); // Triggers at 75% scroll
```

### 3. API Endpoint (`apps/web/app/api/tracking/interaction/route.ts`)

Receives tracking events and logs to database:
- Stores in `Event` table with type `interaction.*`
- Includes metadata: URL, viewport, userAgent, timestamp
- Works for both authenticated and anonymous users
- Fails silently to avoid disrupting UX

## Integration

### Currently Tracked Pages:

1. **Practice Page** (`/practice`)
   - Page views
   - Unit selections
   - Practice session starts
   - 75% scroll depth

2. **Results Page** (`/practice/results`)
   - Page views
   - Invite form submissions (with privacy-safe partial emails)
   - 90% scroll depth

3. **Presence Page** (`/presence`)
   - Page views
   - Tab switches (presence/leaderboards/cohorts)
   - 80% scroll depth

### Adding Tracking to New Pages:

```typescript
import { useTracking, useScrollTracking } from "../../hooks/useTracking";

export default function MyPage() {
  // Track page view on mount
  const { trackClick, trackFormSubmit } = useTracking("My Page");
  useScrollTracking(75);

  const handleAction = () => {
    trackClick("Button Label", { customData: "value" });
    // ... your logic
  };

  return (
    <button onClick={handleAction}>
      Do Something
    </button>
  );
}
```

## Data Structure

Events are stored with:
```typescript
{
  type: "interaction.click" | "interaction.page_view" | "interaction.form_submit" | etc.,
  userId: "user_id" | null, // null for anonymous
  surface: "web",
  metadata: {
    interactionType: "click" | "page_view" | "form_submit" | "scroll",
    label: "Human-readable label",
    element: "CSS selector or name",
    value: number | string,
    url: "https://...",
    viewport: { width, height },
    userAgent: "...",
    timestamp: "ISO date",
    ...customMetadata
  }
}
```

## Querying Tracking Data

### SQL Example - Most Clicked Elements:

```sql
SELECT 
  metadata->>'label' as element,
  COUNT(*) as click_count
FROM "Event"
WHERE type = 'interaction.click'
  AND "createdAt" > NOW() - INTERVAL '30 days'
GROUP BY metadata->>'label'
ORDER BY click_count DESC
LIMIT 10;
```

### SQL Example - Page View Funnel:

```sql
SELECT 
  metadata->>'label' as page,
  COUNT(DISTINCT "userId") as unique_visitors,
  COUNT(*) as total_views
FROM "Event"
WHERE type = 'interaction.page_view'
  AND "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY metadata->>'label'
ORDER BY unique_visitors DESC;
```

### SQL Example - Form Completion Rates:

```sql
WITH form_views AS (
  SELECT 
    "userId",
    metadata->>'label' as form_name
  FROM "Event"
  WHERE type = 'interaction.page_view'
    AND metadata->>'url' LIKE '%/results%'
),
form_submits AS (
  SELECT 
    "userId",
    metadata->>'label' as form_name
  FROM "Event"
  WHERE type = 'interaction.form_submit'
)
SELECT 
  v.form_name,
  COUNT(DISTINCT v."userId") as views,
  COUNT(DISTINCT s."userId") as completions,
  ROUND(COUNT(DISTINCT s."userId")::numeric / COUNT(DISTINCT v."userId") * 100, 2) as completion_rate
FROM form_views v
LEFT JOIN form_submits s ON v."userId" = s."userId"
GROUP BY v.form_name;
```

## Privacy & Compliance

### User Privacy:
- **Opt-out respected**: Checks `localStorage.optedOutGrowth` before tracking
- **No PII logged**: Email addresses are partially masked (e.g., `abc***`)
- **Anonymous support**: Works without user authentication
- **COPPA compliant**: Only tracks necessary interaction data

### GDPR Compliance:
- Users can opt out via profile settings
- Data retention policy: 90 days (configurable)
- Right to deletion: Clear user's interaction events on request

## Future Use Cases

### AI Agent Retraining:
1. **Personalization Agent**: Learn which viral loops work for which personas based on interaction patterns
2. **Orchestrator Agent**: Optimize timing and surface selection for viral prompts
3. **A/B Testing**: Measure engagement with different UX variations
4. **Behavioral Clustering**: Group users by interaction patterns for targeted experiences

### Example Training Data:
```json
{
  "user_persona": "student",
  "session_interactions": [
    { "type": "page_view", "page": "Practice Page", "timestamp": "2024-11-04T19:00:00Z" },
    { "type": "click", "label": "Start Practice", "metadata": { "unit": "World Geography" } },
    { "type": "form_submit", "label": "Send Invite", "metadata": { "score": 85 } }
  ],
  "outcome": "high_viral_coefficient"
}
```

## Performance Considerations

- **Async**: All tracking is fire-and-forget (doesn't block UI)
- **Lightweight**: <2KB client-side code
- **Batching**: Can be extended to batch multiple events (future optimization)
- **Failsafe**: Errors are caught and logged silently

## Monitoring

### Key Metrics to Track:
1. **Event volume**: Events per hour/day
2. **Event types**: Distribution of click/pageview/form/scroll
3. **Opt-out rate**: % of users who disable tracking
4. **API latency**: p50/p95/p99 for tracking endpoint
5. **Error rate**: Failed tracking requests

### Dashboard Integration:
The tracking data can be visualized in the dashboard by adding a new section:
- User journey heatmaps
- Funnel visualization (page view → click → form submit)
- Engagement scores by page/feature

## Next Steps

### Recommended Enhancements:
1. **Event Batching**: Reduce API calls by batching events client-side
2. **Session Replay**: Add lightweight session replay for debugging UX issues
3. **Heatmap Integration**: Visualize click patterns on pages
4. **ML Pipeline**: Build ETL pipeline to prepare data for model training
5. **A/B Test Integration**: Tag events with experiment variants

## Example Queries for AI Training

### User Engagement Score:
```sql
SELECT 
  "userId",
  COUNT(DISTINCT DATE(createdAt)) as active_days,
  COUNT(*) as total_interactions,
  COUNT(CASE WHEN type = 'interaction.form_submit' THEN 1 END) as conversions,
  AVG(CASE WHEN metadata->>'value' IS NOT NULL 
       THEN (metadata->>'value')::numeric 
       ELSE NULL END) as avg_scroll_depth
FROM "Event"
WHERE type LIKE 'interaction.%'
  AND "userId" IS NOT NULL
GROUP BY "userId";
```

### Viral Loop Performance:
```sql
SELECT 
  metadata->>'label' as interaction,
  COUNT(*) as occurrences,
  COUNT(DISTINCT "userId") as unique_users,
  AVG(CASE 
    WHEN LAG(type) OVER (PARTITION BY "userId" ORDER BY "createdAt") = 'interaction.page_view'
    THEN EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "userId" ORDER BY "createdAt")))
  END) as avg_time_to_interaction_sec
FROM "Event"
WHERE type = 'interaction.click'
  AND metadata->>'label' LIKE '%Invite%'
GROUP BY metadata->>'label';
```

---

**Built for:** VT K-Factor Growth Platform  
**Last Updated:** Nov 4, 2024  
**Version:** 1.0

