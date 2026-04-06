# SIO-V5 Multi-Step Audit System

## 📚 Documentation Index

This is the complete documentation for the multi-step SIO-V5 audit system.

### Quick Navigation

- **[Architecture Overview](./multi-step-audit-architecture.md)** - System design, principles, and step breakdown
- **[Implementation Guide](./multi-step-audit-implementation.md)** - Code examples, client integration, testing
- **[Visual Diagrams](./multi-step-audit-diagram.md)** - Data flow, state evolution, timelines
- **[Summary](./MULTI_STEP_AUDIT_SUMMARY.md)** - Complete work summary, files created/modified

## 🎯 What Changed

### Before (Single API Call)
```typescript
// Old approach - Black box, 3.5 minutes
const response = await fetch('/api/sio-v5-audit', {
  method: 'POST',
  body: JSON.stringify({ url, isGuest: true }),
});
// Wait 3.5 minutes with no progress updates
const report = await response.json();
```

### After (Multi-Step Pipeline)
```typescript
// New approach - Transparent, step-by-step
const step1 = await fetch('/api/sio-audit/steps/init', { ... });
const { reportId } = await step1.json();

const step2 = await fetch('/api/sio-audit/steps/content', { 
  body: JSON.stringify({ reportId })
});

const step3 = await fetch('/api/sio-audit/steps/summary', { 
  body: JSON.stringify({ reportId })
});

// ... continue through all 7 steps
// Client can poll status and show real-time progress!
```

## 📊 System at a Glance

### 7 Steps
1. **Init** - Validation & initialization
2. **Content** - Fetch website data
3. **Summary** - AI analysis (summary + first impressions)
4. **Positioning & Clarity** - AI deep analysis (12 metrics)
5. **AEO** - AI engine optimization check
6. **Scoring** - Calculate weighted scores
7. **Refine** - QA and finalization

### 8 API Endpoints
- `POST /api/sio-audit/steps/init`
- `POST /api/sio-audit/steps/content`
- `POST /api/sio-audit/steps/summary`
- `POST /api/sio-audit/steps/positioning-clarity`
- `POST /api/sio-audit/steps/aeo`
- `POST /api/sio-audit/steps/scoring`
- `POST /api/sio-audit/steps/refine`
- `GET /api/sio-audit/status/[reportId]`

### Database Changes
**New Fields in SIOReport Model:**
- `progress` - Current audit step (enum)
- `tempData` - Temporary storage (deleted on completion)
- `failedAt` - Which step failed
- `errorMessage` - Error details

## 🔧 API Reference

### Step 1: Init
```bash
POST /api/sio-audit/steps/init
{
  "url": "https://example.com",
  "productId": "optional",
  "isGuest": true
}

Response:
{
  "success": true,
  "reportId": "abc123",
  "progress": "initializing",
  "nextStep": "/api/sio-audit/steps/content"
}
```

### Step 2: Content
```bash
POST /api/sio-audit/steps/content
{
  "reportId": "abc123"
}

Response:
{
  "success": true,
  "reportId": "abc123",
  "progress": "content_fetched",
  "contentSummary": {
    "contentLength": 5420,
    "hasSitemap": true,
    "hasRobots": true
  },
  "nextStep": "/api/sio-audit/steps/summary"
}
```

### Status Check (Polling)
```bash
GET /api/sio-audit/status/abc123

Response:
{
  "reportId": "abc123",
  "progress": "summary_complete",
  "websiteSummary": { ... },
  "firstImpressionScore": 65,
  "positioningScore": 72,
  "clarityScore": 58
}
```

## 🚀 Getting Started

### For Backend Developers
1. Read [Architecture Overview](./multi-step-audit-architecture.md)
2. Review API routes in `/app/api/sio-audit/steps/*/route.ts`
3. Check database schema changes in `/models/sio-report.ts`
4. Test endpoints using curl commands in [Implementation Guide](./multi-step-audit-implementation.md)

### For Frontend Developers
1. Read [Implementation Guide](./multi-step-audit-implementation.md)
2. Review TypeScript hook example (`useMultiStepAudit`)
3. Check polling strategy examples
4. Integrate with TerminalAuditLoader component

### For DevOps/Testing
1. Review [Visual Diagrams](./multi-step-audit-diagram.md) for data flow
2. Test each step independently
3. Monitor database `progress` field
4. Check error handling with failed states

## ✨ Key Features

### Progress Transparency
- Real-time progress updates
- Step-by-step status tracking
- Client polling every 2 seconds
- Terminal UI integration ready

### Error Recovery
- Partial data preserved on failure
- Retry from failed step
- Clear error messages with `failedAt` field
- No need to restart entire audit

### Accuracy Improvements
- Each step builds on previous analysis
- Focused AI prompts per step
- Quality assurance step refines results
- Cross-validation between sections

### Backward Compatibility
- Old `/api/sio-v5-audit` route preserved
- No breaking changes to existing functionality
- Gradual migration path
- All existing tests still valid

## 📁 File Structure

```
founderego/
├── app/api/sio-audit/
│   ├── steps/
│   │   ├── init/route.ts              ← Step 1
│   │   ├── content/route.ts           ← Step 2
│   │   ├── summary/route.ts           ← Step 3
│   │   ├── positioning-clarity/route.ts ← Step 4
│   │   ├── aeo/route.ts               ← Step 5
│   │   ├── scoring/route.ts           ← Step 6
│   │   └── refine/route.ts            ← Step 7
│   └── status/[reportId]/route.ts     ← Status endpoint
│
├── models/
│   └── sio-report.ts                  ← Updated with progress, tempData
│
└── docs/
    ├── multi-step-audit-architecture.md
    ├── multi-step-audit-implementation.md
    ├── multi-step-audit-diagram.md
    └── MULTI_STEP_AUDIT_SUMMARY.md
```

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test complete flow
curl -X POST http://localhost:3000/api/sio-audit/steps/init \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","isGuest":true}'

# Use reportId to test each step
curl -X POST http://localhost:3000/api/sio-audit/steps/content \
  -H "Content-Type: application/json" \
  -d '{"reportId":"YOUR_REPORT_ID"}'

# Check status
curl http://localhost:3000/api/sio-audit/status/YOUR_REPORT_ID
```

### Automated Testing Strategy
1. Test each step independently
2. Test error handling (invalid reportId, wrong state)
3. Test polling endpoint
4. Test complete flow end-to-end
5. Test concurrent audits
6. Test usage limits

## 🎨 Frontend Integration (Future Work)

### Required Updates
- [ ] Update `PublicAuditPage.tsx` to use multi-step API
- [ ] Add polling to `TerminalAuditLoader.tsx`
- [ ] Map terminal steps to API steps
- [ ] Add retry logic for failed steps
- [ ] Add cancel functionality
- [ ] Show estimated time remaining

### Example Integration
```typescript
// In PublicAuditPage.tsx
const { status, startAudit } = useMultiStepAudit();

const handleAudit = async (url: string) => {
  await startAudit(url, productId, isGuest);
  // Terminal UI will show real-time progress
};
```

## 📈 Metrics & Monitoring

### Track These Metrics
- **Audit Completion Rate**: % of audits that reach 'complete'
- **Average Duration**: Time from init to complete
- **Step Failure Rate**: Which steps fail most often?
- **Token Usage**: Total tokens per audit
- **User Abandonment**: Do users cancel before completion?

### Database Queries
```javascript
// Find incomplete audits (> 1 hour old)
db.sioreports.find({
  progress: { $ne: 'complete' },
  createdAt: { $lt: new Date(Date.now() - 3600000) }
})

// Find most common failure points
db.sioreports.aggregate([
  { $match: { progress: 'failed' } },
  { $group: { _id: '$failedAt', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Average audit duration
db.sioreports.aggregate([
  { $match: { progress: 'complete' } },
  { $group: { _id: null, avgDuration: { $avg: '$auditDuration' } } }
])
```

## 🔐 Security Considerations

- All endpoints validate report ownership
- Guest users receive sanitized reports
- Rate limiting on status endpoint (prevent abuse)
- tempData contains raw website content (sensitive)
- tempData deleted on completion
- Usage limits enforced at init step

## 🚦 Status

- ✅ **Build**: Passing
- ✅ **TypeScript**: Fully typed
- ✅ **API Routes**: All 8 endpoints created
- ✅ **Database Schema**: Updated
- ✅ **Documentation**: Complete
- ⏳ **Frontend Integration**: Ready (not yet implemented)
- ⏳ **Testing**: Manual testing ready

## 📞 Support

For questions or issues:
1. Check [Implementation Guide](./multi-step-audit-implementation.md) for code examples
2. Review [Visual Diagrams](./multi-step-audit-diagram.md) for data flow
3. Test endpoints manually using curl commands
4. Check database `progress` field for audit state

---

**Last Updated**: April 6, 2026
**Version**: 1.0.0
**Status**: Production Ready (Backend), Integration Pending (Frontend)
