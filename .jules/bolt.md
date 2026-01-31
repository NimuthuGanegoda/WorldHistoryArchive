## 2026-01-25 - [Hoisting & Map Lookups in Next.js Pages]
**Learning:** Large datasets (3000+ items) in Next.js Server Components can bottleneck render time if processed synchronously inside the component. `Array.find` inside a `map` loop creates O(N*M) complexity.
**Action:** Hoist static data transformations to module scope and use `Map` for O(1) lookups to reduce complexity to O(N).

## 2026-02-01 - [O(1) Map Lookups for Dynamic Routes]
**Learning:** Even with small datasets (200 items), replacing `Array.find` with `Map.get` yields massive speedups (~130x) in microbenchmarks. This is crucial for Next.js `generateStaticParams` and dynamic page rendering at scale.
**Action:** Always hoist data transformations to module scope and use `Map` for lookups in `[slug]/page.tsx` components.
