# Reusable Audit Components - Summary

## Overview

Created a complete reusable audit component system that can be imported anywhere (public pages, dashboard, etc.) with zero configuration.

## Architecture

```
/components/audit/
├── index.ts                    ← Centralized exports
├── useAudit.ts                 ← Hook for multi-step audit API
├── AuditForm.tsx               ← Reusable URL input form
├── AuditLoader.tsx             ← Terminal loader with default steps
├── TerminalAuditLoader.tsx     ← Terminal UI component
└── PublicAuditPage.tsx         ← Public page using all components
```

## Components Created

### 1. `useAudit` Hook (`useAudit.ts`)

**Purpose**: Manages the entire multi-step audit flow

**Features**:
- Calls init API (validates + fetches content)
- Sequentially runs through all 6 steps
- Polls status endpoint for real-time updates
- Handles cached reports (409 conflict)
- Provides progress updates
- Error handling with step identification

**API**:
```typescript
const {
  status,           // Current audit status
  startAudit,       // Start audit with URL
  isRunning,        // Is audit running?
  isComplete,       // Is audit complete?
  isFailed,         // Did audit fail?
  isIdle,           // Hasn't started yet
} = useAudit({
  isGuest: true,
  productId: "optional",
  pollInterval: 2000,
  onComplete: (report) => { },
  onError: (error) => { },
});
```

**Status Object**:
```typescript
{
  progress: 'idle' | 'content_fetched' | 'summary_complete' | 
            'positioning_clarity_complete' | 'aeo_complete' | 
            'scoring_complete' | 'complete' | 'failed',
  reportId: string | null,
  overallScore: number | null,
  data: SIOV5Report | null,
  error: string | null,
  failedAt: string | null,
  contentSummary: { contentLength, hasSitemap, hasRobots } | null,
}
```

---

### 2. `AuditForm` Component (`AuditForm.tsx`)

**Purpose**: Reusable URL input form with validation

**Features**:
- URL validation before submit
- Loading state
- Error display
- Customizable labels and placeholders

**Props**:
```typescript
interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
  defaultUrl?: string;
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
  className?: string;
}
```

**Usage**:
```tsx
<AuditForm
  onSubmit={handleSubmit}
  isLoading={isRunning}
  error={status.error}
  buttonText="Get Free Audit"
  loadingText="Running audit (3-4 min)..."
/>
```

---

### 3. `AuditLoader` Component (`AuditLoader.tsx`)

**Purpose**: Terminal loader with pre-configured SIO-V5 steps

**Features**:
- Pre-defined audit steps for SIO-V5
- Shows real-time progress
- Terminal UI with animations
- Auto-scrolling

**Props**:
```typescript
interface AuditLoaderProps {
  currentProgress: AuditProgress;
  url: string;
  onComplete?: () => void;
  className?: string;
}
```

**Usage**:
```tsx
<AuditLoader
  currentProgress={status.progress}
  url={url}
  onComplete={() => console.log("Done!")}
/>
```

---

### 4. `TerminalAuditLoader` Component (`TerminalAuditLoader.tsx`)

**Purpose**: Low-level terminal UI component

**Features**:
- Linux terminal aesthetic
- Traffic light buttons
- Monospace font
- Auto-scrolling
- Blinking cursor
- Color-coded output

**Props**:
```typescript
interface TerminalAuditLoaderProps {
  command?: string;
  steps: AuditStep[];
  currentProgress: AuditProgress;
  onComplete?: () => void;
  className?: string;
}
```

---

## How It Works Together

### Public Page Example

```tsx
import { AuditForm, AuditLoader, useAudit } from "@/components/audit";

function PublicAuditPage() {
  const { status, startAudit, isRunning, isComplete } = useAudit({
    isGuest: true,
  });

  return (
    <div>
      <AuditForm
        onSubmit={startAudit}
        isLoading={isRunning}
        error={status.error}
      />
      
      {isRunning && (
        <AuditLoader
          currentProgress={status.progress}
          url={url}
        />
      )}
      
      {isComplete && status.data && (
        <DashboardSIOReport {...status.data} />
      )}
    </div>
  );
}
```

### Dashboard Example (Future)

```tsx
import { AuditForm, AuditLoader, useAudit } from "@/components/audit";

function DashboardAuditPage({ productId }) {
  const { status, startAudit, isRunning, isComplete } = useAudit({
    isGuest: false,
    productId,
  });

  return (
    <div>
      <AuditForm
        onSubmit={startAudit}
        isLoading={isRunning}
        error={status.error}
        buttonText="Run Audit"
        loadingText="Analyzing..."
      />
      
      {isRunning && (
        <AuditLoader
          currentProgress={status.progress}
          url={url}
        />
      )}
      
      {isComplete && status.data && (
        <DashboardSIOReport {...status.data} />
      )}
    </div>
  );
}
```

---

## Audit Flow

```
User enters URL
    ↓
AuditForm validates
    ↓
startAudit() called
    ↓
Step 1: POST /api/sio-audit/steps/init
    ↓ (validates + fetches content)
    ↓
Step 2: POST /api/sio-audit/steps/summary
    ↓ (AI: summary + first impressions)
    ↓
Step 3: POST /api/sio-audit/steps/positioning-clarity
    ↓ (AI: 12 metrics analysis)
    ↓
Step 4: POST /api/sio-audit/steps/aeo
    ↓ (AI: AEO visibility)
    ↓
Step 5: POST /api/sio-audit/steps/scoring
    ↓ (Calculate weighted scores)
    ↓
Step 6: POST /api/sio-audit/steps/refine
    ↓ (AI: QA + finalize)
    ↓
Complete! Return report
```

---

## Progress States

```
idle → content_fetched → summary_complete → 
positioning_clarity_complete → aeo_complete → 
scoring_complete → complete
                        ↓
                    (or failed at any point)
```

---

## Key Features

### 1. **Zero Configuration**
```tsx
// Just import and use!
const { startAudit } = useAudit();
<AuditForm onSubmit={startAudit} />
<AuditLoader currentProgress={status.progress} url={url} />
```

### 2. **Automatic Step Sequencing**
- Hook automatically calls next step
- No manual step management needed
- Handles retries and errors

### 3. **Real-Time Progress**
- Terminal shows actual API progress
- No simulated delays
- Accurate step tracking

### 4. **Cached Report Handling**
- Detects existing reports (409 conflict)
- Fetches cached report automatically
- Shows warning to user

### 5. **Error Recovery**
- Identifies which step failed
- Preserves partial data
- Clear error messages

---

## Reusability

### Use in Public Page
```tsx
import { AuditForm, AuditLoader, useAudit } from "@/components/audit";

<AuditForm onSubmit={startAudit} isLoading={isRunning} />
{isRunning && <AuditLoader currentProgress={status.progress} url={url} />}
```

### Use in Dashboard
```tsx
import { AuditForm, AuditLoader, useAudit } from "@/components/audit";

<AuditForm 
  onSubmit={startAudit} 
  isLoading={isRunning}
  productId={product.id}
  buttonText="Run New Audit"
/>
{isRunning && <AuditLoader currentProgress={status.progress} url={url} />}
```

### Use in Modal
```tsx
import { useAudit } from "@/components/audit";

const { startAudit, status } = useAudit({ productId });
// Use in any modal/dialog
```

---

## Files Modified/Created

### Created (5 files)
- `/components/audit/useAudit.ts` - Hook for multi-step audit
- `/components/audit/AuditForm.tsx` - Reusable form component
- `/components/audit/AuditLoader.tsx` - Terminal loader with defaults
- Updated `/components/audit/TerminalAuditLoader.tsx` - Accept progress prop
- Updated `/components/audit/PublicAuditPage.tsx` - Uses all components

### Updated (1 file)
- `/components/audit/index.ts` - Exports all components

---

## Testing

### Test Public Audit
```bash
npm run dev
open http://localhost:3000/sio-audit
```

### Test with URL param
```bash
open http://localhost:3000/sio-audit?url=https://example.com
```

---

## Summary

✅ **Reusable**: Import anywhere (public, dashboard, modals)
✅ **Zero Config**: Works out of the box
✅ **Type Safe**: Full TypeScript support
✅ **Real Progress**: Shows actual API progress
✅ **Error Handling**: Clear error messages with step identification
✅ **Cached Reports**: Handles existing reports automatically
✅ **Terminal UI**: Beautiful Linux terminal aesthetic
✅ **Build Status**: ✅ Passing

**Ready for dashboard integration!** 🚀
