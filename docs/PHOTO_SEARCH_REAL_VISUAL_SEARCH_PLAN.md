# Photo search — real visual search plan

## Current state (hybrid prototype)

`POST /api/search/photo` is a **hybrid prototype**:

- Validates JPG/PNG/WEBP ≤ 5 MB
- Does **not** persist the upload
- Does **not** analyze image pixels
- Ranks public listings with photos using:
  - optional `vertical`
  - optional `category`
  - optional `queryHint` + filename tokens
  - recency

Response always includes:

- `mode: "hybrid-prototype"`
- `visualSearch: false`

## Goal later

True visual similarity for marketplace listings without pretending the current prototype is Taobao-level.

## Option A — embeddings + vector store

1. On listing image upload/publish, generate an image embedding
2. Store embeddings separately (not in the main listing row clutter)
3. On photo search, generate query embedding and find nearest neighbors (cosine similarity)
4. Candidates: `pgvector`, or an external vector service

Pros: real similarity, reusable offline ranking  
Cons: storage/migration, model choice, indexing jobs

## Option B — external AI / OCR labels

1. Send photo to an AI/OCR/label API
2. Extract keywords/labels
3. Search listings by those keywords

Pros: faster to ship relevance  
Cons: cost, vendor lock-in, privacy, latency

## Option C — local model inside the app

1. Run a local embedding model in the Next.js/Node process or sidecar

Pros: no external API  
Cons: large deps, Railway cold starts, memory pressure, fragile deploys

## Recommendation for TutOpt / Railway

1. Keep the hybrid prototype for UX honesty and usefulness now
2. Prototype Option B or a small external embeddings worker next
3. Only then consider Option A with an explicit migration (`pgvector` or separate store)
4. Avoid shipping heavy ML libraries directly into the Next.js production bundle without a load test

## Non-goals for the next immediate phase

- Fake “similar image” UX claims
- Prisma schema changes without approval
- Permanent storage of temporary search uploads
- Breaking ordinary text search
