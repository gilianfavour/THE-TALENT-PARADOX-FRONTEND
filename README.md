# SecondLook - Candidate Portal (Frontend)

Next.js 16 frontend for the Donswift Talent Paradox solution by Team Quantum Coders.

## What it does

- **Job board** - live vacancies fetched from the Laravel API with extracted competencies
- **Apply** - paste a CV; the engine parses claims and scores you against the role (and every other role)
- **Skills check** - short scenario questions that produce *demonstrated* evidence, not just CV claims
- **Candidate portal** - live application status, transparent "why you match" explanations, other roles you might fit, and instant answers (no phone call needed)

## Run

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8500/api" > .env.local
npm run dev
```

Portal: http://localhost:3000 - backend API at http://localhost:8500 (see backend repo for setup + seed data).
