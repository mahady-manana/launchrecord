# Multi-Step SIO Audit - Implementation Guide

## Quick Start

This guide shows how to use the new multi-step audit API to replace the single-call audit.

## API Endpoints Created

All endpoints are under `/api/sio-audit/steps/`:

1. **POST** `/api/sio-audit/steps/init` - Initialize audit
2. **POST** `/api/sio-audit/steps/content` - Fetch website content
3. **POST** `/api/sio-audit/steps/summary` - Generate summary & first impressions
4. **POST** `/api/sio-audit/steps/positioning-clarity` - Analyze positioning & clarity
5. **POST** `/api/sio-audit/steps/aeo` - Analyze AEO visibility
6. **POST** `/api/sio-audit/steps/scoring` - Calculate final scores
7. **POST** `/api/sio-audit/steps/refine` - Refine and finalize report

**Status Endpoint:**
- **GET** `/api/sio-audit/status/[reportId]` - Check audit progress

## Client Integration Example

### TypeScript/React Hook

```typescript
import { useState, useCallback } from 'react';

type AuditProgress = 
  | 'initializing'
  | 'content_fetched'
  | 'summary_complete'
  | 'positioning_clarity_complete'
  | 'aeo_complete'
  | 'scoring_complete'
  | 'complete'
  | 'failed';

interface AuditStatus {
  progress: AuditProgress;
  reportId?: string;
  overallScore?: number;
  data?: any;
  error?: string;
}

export function useMultiStepAudit() {
  const [status, setStatus] = useState<AuditStatus>({
    progress: 'initializing',
  });

  const startAudit = useCallback(async (
    url: string,
    productId?: string,
    isGuest = true
  ) => {
    try {
      // Step 1: Initialize
      const initResponse = await fetch('/api/sio-audit/steps/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, productId, isGuest }),
      });

      const initData = await initResponse.json();
      
      if (!initResponse.ok) {
        setStatus({ progress: 'failed', error: initData.error });
        return null;
      }

      const reportId = initData.reportId;
      setStatus({ progress: 'initializing', reportId });

      // Step 2: Fetch Content
      setStatus(prev => ({ ...prev, progress: 'content_fetched' }));
      const contentResponse = await fetch('/api/sio-audit/steps/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        setStatus({ progress: 'failed', reportId, error: errorData.error });
        return null;
      }

      // Step 3: Summary
      setStatus(prev => ({ ...prev, progress: 'summary_complete' }));
      const summaryResponse = await fetch('/api/sio-audit/steps/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        setStatus({ progress: 'failed', reportId, error: errorData.error });
        return null;
      }

      // Step 4: Positioning & Clarity
      setStatus(prev => ({ ...prev, progress: 'positioning_clarity_complete' }));
      const positioningResponse = await fetch('/api/sio-audit/steps/positioning-clarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!positioningResponse.ok) {
        const errorData = await positioningResponse.json();
        setStatus({ progress: 'failed', reportId, error: errorData.error });
        return null;
      }

      // Step 5: AEO
      setStatus(prev => ({ ...prev, progress: 'aeo_complete' }));
      const aeoResponse = await fetch('/api/sio-audit/steps/aeo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!aeoResponse.ok) {
        const errorData = await aeoResponse.json();
        setStatus({ progress: 'failed', reportId, error: errorData.error });
        return null;
      }

      // Step 6: Scoring
      setStatus(prev => ({ ...prev, progress: 'scoring_complete' }));
      const scoringResponse = await fetch('/api/sio-audit/steps/scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!scoringResponse.ok) {
        const errorData = await scoringResponse.json();
        setStatus({ progress: 'failed', reportId, error: errorData.error });
        return null;
      }

      // Step 7: Refine & Finalize
      setStatus(prev => ({ ...prev, progress: 'complete' }));
      const refineResponse = await fetch('/api/sio-audit/steps/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, isGuest }),
      });

      const refineData = await refineResponse.json();

      if (!refineResponse.ok) {
        setStatus({ progress: 'failed', reportId, error: refineData.error });
        return null;
      }

      setStatus({
        progress: 'complete',
        reportId,
        overallScore: refineData.data.overallScore,
        data: refineData.data,
      });

      return refineData.data;
    } catch (error: any) {
      setStatus({
        progress: 'failed',
        error: error.message || 'Unknown error',
      });
      return null;
    }
  }, []);

  const pollStatus = useCallback(async (reportId: string) => {
    const response = await fetch(`/api/sio-audit/status/${reportId}`);
    const data = await response.json();
    
    setStatus({
      progress: data.progress,
      reportId,
      overallScore: data.overallScore,
      data: data.data,
    });

    return data;
  }, []);

  return {
    status,
    startAudit,
    pollStatus,
    isRunning: status.progress !== 'complete' && status.progress !== 'failed',
    isComplete: status.progress === 'complete',
    isFailed: status.progress === 'failed',
  };
}
```

### Usage in Component

```typescript
function AuditComponent() {
  const { status, startAudit, isRunning, isComplete, isFailed } = useMultiStepAudit();

  const handleAudit = async (url: string) => {
    const report = await startAudit(url, undefined, true);
    if (report) {
      console.log('Audit complete!', report);
    }
  };

  if (isRunning) {
    return <TerminalLoader progress={status.progress} />;
  }

  if (isFailed) {
    return <Error message={status.error} />;
  }

  if (isComplete && status.data) {
    return <ReportDisplay report={status.data} />;
  }

  return <AuditForm onSubmit={handleAudit} />;
}
```

## Polling Strategy (Alternative)

For better UX, you can poll the status endpoint:

```typescript
useEffect(() => {
  if (!status.reportId || status.progress === 'complete' || status.progress === 'failed') {
    return;
  }

  const pollInterval = setInterval(async () => {
    const data = await pollStatus(status.reportId!);
    
    if (data.progress === 'complete' || data.progress === 'failed') {
      clearInterval(pollInterval);
    }
  }, 2000); // Poll every 2 seconds

  return () => clearInterval(pollInterval);
}, [status.reportId, status.progress, pollStatus]);
```

## Error Handling

Each step returns structured errors:

```typescript
{
  error: "Error message",
  failedAt: "step_name", // Which step failed
  errorMessage: "Detailed error message"
}
```

### Retry from Failed Step

If a step fails, you can retry from that step:

```typescript
const retryFromFailure = async (reportId: string, failedStep: string) => {
  // Re-run the failed step
  const response = await fetch(`/api/sio-audit/steps/${failedStep}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId }),
  });
  
  // Continue with remaining steps...
};
```

## Benefits Over Single-Call API

1. **Progress Transparency**: Client knows exact audit progress
2. **Error Recovery**: Partial data preserved on failure
3. **Better UX**: Can show step-by-step progress to users
4. **Accuracy**: Each step builds on previous analysis
5. **Debugging**: Clear error localization
6. **Token Efficiency**: Focused prompts per step

## Migration from Old API

The old `/api/sio-v5-audit` route remains unchanged for backward compatibility.

To migrate:
1. Replace single POST call with sequential step calls
2. Add polling for progress updates
3. Update error handling for step-specific errors

## Testing

Test each step independently:

```bash
# Step 1: Init
curl -X POST http://localhost:3000/api/sio-audit/steps/init \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","isGuest":true}'

# Step 2: Content (use reportId from step 1)
curl -X POST http://localhost:3000/api/sio-audit/steps/content \
  -H "Content-Type: application/json" \
  -d '{"reportId":"REPORT_ID_HERE"}'

# Check status
curl http://localhost:3000/api/sio-audit/status/REPORT_ID_HERE
```

## Next Steps

- [ ] Update PublicAuditPage.tsx to use multi-step API
- [ ] Add polling to TerminalAuditLoader
- [ ] Add retry logic for failed steps
- [ ] Add cancel audit functionality
- [ ] Add estimated time remaining calculation
