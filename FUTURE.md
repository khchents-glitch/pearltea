# Features to be implemented in the future

## Developer-focused, granular improvements

- Product-level ingredient options (per-item options)
- SKU-based inventory tracking, not just batch-level
- Barcode scan inputs (handheld devices)

Small scope / pragmatic next pieces

- Simple cash reconciliation cash-out/check-in
- Multi-day shift summaries (time ranges not just daily fixed)

Medium scope UX refinements

- Toast for cart updates instead of alerts
- Keyboard shortcuts for POS
- Sticky cart sidebar parameterizable while scrolling content

High-value features

- Waitlist queue with mobile push notifications (Twillio/Directus)
- Kitchen display system (KDS) - check for sub-agent for KDS dashboard
- Multi-Invoice & modifier tracking (e.g., from orders to menu-item-level breakdown)
- Marketing banner context shown before checkout

Extended enhancements

- Scheduler for menu changes, discounts, combo promos
- Brand logo upload, menu layout customization
- Anemone/KDS-style kitchen monitor for order preparation tracking
- Dashboard telegraphs (top insights/cards) summarizing prep statusレ (技術プロンプト: performance）
- In-memory job queue or message queue for inter-backend reliability

## Front-end
- Responsive + on iPad + on mobile (handheld POS)
- Offline-first strategies, local storage backup in angular or immediate cache-first strategies

## Backend
- API versioning for gradual migration
- Implement patterns and prefer message-driven reliability for cross-service invokes

## Database
- Run migration guard and account-frontend telemetry inbound
- End-to-end rollback after migration (Fiji or similar)
- Keep a degraded fallback mode; plan safe versioned migration related to known IDs/foreign keys

## Security and reliability
- HashBurning of backup log files
- Explicit table-level unauthorized ACL's
- Introduce JWT refresh mechanism and token revocation

## Integration
- Stripe support with recommended rate of features incremental; restructure POST after integration for immediate increase (staff dashboards, shift planning)
- Payment gateway AB bench politely (Line Pay, Tabao Pay)
- Open implementation of a unified setting store (key=value) and central config endpoint

## DevOps
- CI/CD pipeline template in Zeabur to create commit-based announces
- Chaos engineering survival plan for DB failover
- Environments staging with auto-scale nature (listen to queue size)
- On-call schedule for team
- SRE outage alerting (Prometheus + Grafana, suggestion: use a sub-agent to auto-fine-tune charts and thresholds)

## Measurement
- Collections/recipe telemetry for manual transfer to试卷
- A/B preview helper on dev environment for user acceptance testing

## Profit/loss
- Actual recipe costing (per batch)
- beverage-serving break down for recipe tracking and discount eligibility with MVP-level flexibility