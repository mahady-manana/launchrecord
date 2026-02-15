Now we need click tracking on Your task is to implement a **robust click tracking system**. Follow these requirements carefully:

---

### 1. MongoDB Schema

- One document per Launch.
- Keep **all-time clicks** and **daily clicks** array (last 30 days) for accurate aggregation.
- Keep **all_time_outbound clicks** and **daily_outbound_clicks** array (last 30 days) for accurate aggregation.
- Schema example:

{
....
"all_time": 1023,
"all_time_outbound": 120,
"daily_clicks": [{ "date": "2026-02-14", "clicks": 10 }],
"daily_outbound_clicks": [{ "date": "2026-02-14", "clicks": 2 }]
....
}

---

### 2. Frontend Click Logic

- Only count clicks if the **user stays ≥ X seconds** on the product page (e.g., 7 seconds).
- Optional: only trigger if the **tab is visible**.
- Send click to backend via `/api/click` endpoint.
- Use fetch POST with `{ productId }`.
- No duplicate click for a session, add session id to keep data integrity

---

### 3. Backend Click Handling

- Increment **all_time-** and **today's counter** atomically.
- If today's entry does not exist, **push a new object** into `daily_clicks`.
- Use **$slice** operator to **keep daily_clicks array capped at 30 elements** (avoid cron job).
- No duplicate click for a session, check session id to keep data integrity

**Example logic:**

1. Check if `daily_clicks.date = today` exists → $inc
2. Else → $push new daily entry with $slice
3. Use upsert to auto-create product document if needed.

---

### 4. Anti-bot / Session Filtering

- Track **one click per product per session/day**.
- Optional: rate-limit max 1 click per IP per product per minute.
- Optional: filter suspicious user-agents or server-side curl.

---

### 5. Aggregation Helpers

- Compute clicks for:
  - Today
  - This week (Mon → today)
  - Last week
  - This month
- Use `daily_clicks` array to calculate these **on-demand**.

---

### Requirements

- Robust: Prevent fake clicks or bot abuse.
- No cron jobs needed; use `$slice` to cap array size.
- Scalable: Works for thousands of products.
- Maintainable: Clear modular code, easy to extend.

---

Your task:

- Create model automatically for every product (maybe on product creation)
- Api for tracking
- Include **aggregation helper functions** to get today/week/month stats.
- Stores, hooks actions, and more on front
