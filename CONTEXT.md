# TradeTalks Project Context & Change Log

## 📌 Project Overview & Rules
* **Direct Partner ID**: `417398`
* **Season Date Range**: `Jan 1, 2025` (`2025-01-01`) to `Dec 30, 2026` (`2026-12-30`).
* **Minimum Net Deposit Rule**: $100 net deposit (`mt_net_deposits >= 100`) required for challenge gate verification.
* **Washout Minimum Equity**: $1.00.

---

## 🛠️ Recent Bugs Identified & Fixes

### 1. Challenge Gate Verification Error Propagation
* **Bug**: When a client with `$0` net deposit attempted verification, `verifyAlpariClientDirect` threw `INSUFFICIENT_FUNDS`. However, internal `catch` blocks in `lib/alpariApi.ts` swallowed this error and returned `null`.
* **Impact**: `/api/verify-client/route.ts` received `null` and displayed a misleading error: *"Client ID was not found in our challenge database..."*.
* **Fix**: Updated `lib/alpariApi.ts` catch blocks to re-throw `INSUFFICIENT_FUNDS`, allowing `/api/verify-client/route.ts` to return the proper user guidance (*"Your account does not meet the minimum $100 net deposit requirement..."*).

---

### 2. Admin Live API Search "No metrics found"
* **Bug**: Bulk API search (`getIntegratedLeaderboard`) fetched all partner records in a single call. Alpari caps bulk API responses (~1,300 records), causing recently registered clients (like `f04a4f42bff`) to be omitted from the bulk response.
* **Impact**: Admin Live API Search returned *"No metrics found"* for valid recent referral clients.
* **Fix**: Added `searchSingleAlpariClient()` fallback in `lib/alpariApi.ts` and integrated it into `app/api/admin/traders/live-search/route.ts`. If a trader is not in the bulk list, a targeted search (recent 60 days / season range) is executed.

---

### 3. Date Range Standardized (`2025-01-01` to `2026-12-30`)
* **Bug/Inconsistency**: Code previously referenced `2020-01-01` to `2028-12-30` in bulk queries and `2025-10-01` in verification fallbacks.
* **Instruction**: Standardize all API date ranges to `2025-01-01` through `2026-12-30` across all endpoints (`getIntegratedLeaderboard`, `verifyAlpariClientDirect`, `searchSingleAlpariClient`), removing all `2020` date references.

---

## ✅ Applied Changes (Approved by User)

### File: `lib/alpariApi.ts`
1. **`getIntegratedLeaderboard()`**:
   - Updated `fromDate`: `"2025-01-01"`
   - Updated `customToDate`: `"2026-12-30"`
2. **`verifyAlpariClientDirect()`**:
   - Standardized `SEASON_START_DATE` ➔ `"2025-01-01"`, `SEASON_END_DATE` ➔ `"2026-12-30"`.
3. **`searchSingleAlpariClient()`**:
   - Added targeted lookup fallback using `"2025-01-01"` to `"2026-12-30"`.

---

## 🔒 Execution Policy
* **Strict Rule**: No code edits will be performed without explicit user approval.
* **Workflow**: Review `CONTEXT.md` before making any modifications to maintain complete state consistency.
