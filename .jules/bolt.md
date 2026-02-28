## 2026-01-25 - [Hoisting & Map Lookups in Next.js Pages]
**Learning:** Large datasets (3000+ items) in Next.js Server Components can bottleneck render time if processed synchronously inside the component. `Array.find` inside a `map` loop creates O(N*M) complexity.
**Action:** Hoist static data transformations to module scope and use `Map` for O(1) lookups to reduce complexity to O(N).

## 2026-02-01 - [O(1) Map Lookups for Dynamic Routes]
**Learning:** Even with small datasets (200 items), replacing `Array.find` with `Map.get` yields massive speedups (~130x) in microbenchmarks. This is crucial for Next.js `generateStaticParams` and dynamic page rendering at scale.
**Action:** Always hoist data transformations to module scope and use `Map` for lookups in `[slug]/page.tsx` components.

## 2026-02-05 - [Pre-computing Fuzzy Matches]
**Learning:** When linking datasets via fuzzy logic (e.g. string inclusion), doing it inside the render loop is O(N*M). For static data, pre-compute the relationships into a Map at module scope.
**Action:** Identify fuzzy relationships (like `site.kingdom` string matching) and resolve them into a `Map<ID, RelatedEntity>` once at startup.

## 2026-02-17 - [Optimized Regex & Schwartzian Transform]
**Learning:** `Array.sort` calls the comparator O(N log N) times. If the comparator involves Regex or string manipulation (like `toLowerCase()`), it creates massive overhead.
**Action:** Use case-insensitive Regex (`/pattern/i`) to avoid `toLowerCase()` allocations. Combine with Schwartzian transform (map-sort-map) to run expensive parsing only once per item (O(N)).
