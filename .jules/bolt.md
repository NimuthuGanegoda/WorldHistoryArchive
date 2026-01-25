## 2026-01-25 - [Hoisting & Map Lookups in Next.js Pages]
**Learning:** Large datasets (3000+ items) in Next.js Server Components can bottleneck render time if processed synchronously inside the component. `Array.find` inside a `map` loop creates O(N*M) complexity.
**Action:** Hoist static data transformations to module scope and use `Map` for O(1) lookups to reduce complexity to O(N).
