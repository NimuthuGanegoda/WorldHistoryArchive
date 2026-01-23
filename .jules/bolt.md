## 2025-01-22 - Static Data Optimization in Server Components
**Learning:** In Next.js Server Components, expensive data transformations (like grouping lists or creating lookup maps) from static JSON imports should be done at the module scope, not inside the component function. This ensures they run only once when the module is loaded, not on every request/render.
**Action:** Move static data processing outside the component function definition.

## 2025-01-22 - Data Integrity vs TypeScript Types
**Learning:** TypeScript interfaces might not match the actual JSON data structure. In this case, `Kingdom` interface expected `slug` and `title`, but `kingdoms.json` had `id` and `name`. This led to a bug where links were broken because code used `slug` (undefined).
**Action:** Always verify JSON data structure against the code's expectations, especially when "any" or loose casting is involved.
