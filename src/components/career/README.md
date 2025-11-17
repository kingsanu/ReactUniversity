# Career Paths Explorer — Frontend README

This folder contains React components, routes, hooks, and helper utilities for the Career Paths Explorer feature.

Purpose

- Provide an interactive experience where students can explore recommended career families and roles based on assessment results.
- Allow filtering, searching, favoriting, and comparing careers.
- Display a Top-3 widget on the dashboard summarizing the user's best matches.

Structure

- `src/components/career/`
  - `CareerExplorer.tsx` — explorer UI (grid & filters)
  - `CareerCard.tsx` — individual career card
  - `CareerFilters.tsx` — filters & search
  - `CareerDetails.tsx` — details page
  - `Top3Careers.tsx` — dashboard widget
  - `CompareTable.tsx` — side-by-side comparison for up to 3 careers
  - `FavoriteButton.tsx` — saves to favorites

Hooks & Services

- `src/services/careerService.ts` — API integration for careers
- `src/hooks/useCareerQueries.ts` — react-query hooks for fetching careers
- `src/hooks/useCareerRecommendations.ts` — suggestions & AI ranking integration
- `src/hooks/useFavorites.ts` — favorites management

Local persistence and mock data

- Careers shown on the explorer and admin are read from an in-memory mock via `src/services/careerService.ts`.
- Favorites persist to `localStorage` per user and sync across components using the `favorites_updated` custom event.
- Admin edits to careers use mock CRUD and invalidate caches in react-query so changes appear in the explorer immediately.

Localization

- All user-facing strings added to `src/lib/i18n/locales/en.json` and `src/lib/i18n/locales/es.json` keys:
  - `careerExplorer.title`, `careerExplorer.filter.{industry,education,location}`
  - `careerCard.match`, `careerCard.favorite`, `careerCard.compare`
  - `careerDetails.title`, `careerDetails.skills`, ...

Styling

- Use Tailwind/utility-first or project-convention CSS (existing utilities). Create atomic, accessible styles and follow a11y patterns.

Testing

- Use `@testing-library/react` + `jest` for unit tests for UI components.
- Add Cypress e2e to test flows (Top 3 on dashboard, favorites, compare, details)

How to run

- The project uses the global Next.js app, `react-query`, and `i18n`.
- Add Career API routes to backend spec and ensure `src/services/careerService.ts` URL base is set to `/api`.

Local testing

- Unit tests: `npm test` or `npm run test` will run jest. Example unit tests are inside `src/components/career/__tests__`.
- E2E: We recommend Cypress for full flows: dashboard/widets, explorer, favorites, compare.

Notes

- To experiment with UI and translations locally, change app language to Spanish via the LanguageSwitcher.
- For backend integration, use `API_SPEC_CAREER_PATHS.yaml` as a source-of-truth. The backend can provide mocked endpoints while frontend is developed.

Admin pages

- Use the Admin panel to manage career families and roles: `/dashboard/admin/careers`.
- Admin roles is required to access the admin pages; use `useAdminAccess` hook to check admin permissions.

Testing the flow

- Visit `/dashboard/admin/careers` and create a new career; it should appear immediately in `/careers` due to react-query invalidation.
- Star/favorite a career and refresh; favorites are persisted in `localStorage`.
- Toggle compare selections from cards, then click Compare to see the compare page.

Guidelines & Best Practices

- Keep logic in hooks; UI components should be presentational.
- Use `react-query` for caching and optimistic UI updates.
- Use localized strings from `src/lib/i18n/locales/*`.
- Expose metrics via admin analytics endpoints; do not leak PII.
