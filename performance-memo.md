# Executive Performance Evaluation Memo: SSR vs. ISR in Next.js

**Course / Project:** IPT02 — NEUST CICT Student Directory  
**Application Architecture:** Next.js 16 (App Router), MySQL on Aiven Cloud, Netlify REST API  
**Testing Tool:** Grafana k6 v2.4.0  

---

### 1. The Setup Process
A Next.js 16 App Router application was implemented with three primary pages: an authentication portal (`/login`), a Server-Side Rendered directory (`/students-ssr`), and an Incremental Static Regeneration directory (`/students-isr`). Authentication authenticates student credentials against the Netlify REST API (`/api/login`), issuing a JWT stored in browser cookies. The SSR page dynamically validates authentication and queries live student records from MySQL via the protected endpoint (`/api/students`) on every request. The ISR page pre-renders static student data at build time and revalidates in the background every 60 seconds (`revalidate: 60`).

### 2. Results of the Load Test
A load test was executed on the SSR page using Grafana k6, ramping up to 20 concurrent Virtual Users (VUs) over 25 seconds. The SSR endpoint handled 141 requests with a 100% check success rate and 0.00% HTTP failure rate, processing 82 MB of network data. Under continuous database query execution, the SSR page achieved an average response time of 1.80s, a median of 1.67s, and a 95th percentile (p95) latency of 2.87s (throughput of 5.0 requests/second).

### 3. Observed Performance Differences
Comparative load testing revealed distinct architectural trade-offs:
- **Server-Side Rendering (SSR):** Executes per-request server computation, JWT authentication, and live MySQL queries, averaging 1.79s latency with a 2.42s p95.
- **Incremental Static Regeneration (ISR):** Delivers pre-compiled HTML directly from the static cache in 317ms average and 443ms p95, achieving a 5.6x speedup and over triple the throughput (~16.4 req/s vs. ~4.9 req/s).

ISR provides optimal read scalability and reduced database strain, whereas SSR is essential when real-time data freshness and per-request access enforcement are paramount.
