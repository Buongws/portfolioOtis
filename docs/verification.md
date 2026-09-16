# Verification

Date: 2026-09-16. Local production build on macOS, Node.js 20.19.6, Next.js 16.3.5. The recommended development runtime is Node.js 22 via `.nvmrc`.

## Code Checks

- `npm run check`: TypeScript strict checks, ESLint with zero warnings, and Prettier passed.
- `npm run build`: passed; `/`, `/impact`, `/products`, `/cover` are statically prerendered.
- `npm run assets:optimize`: passed; optimized assets can be regenerated from the downloaded Figma originals.
- Husky hook path is `.husky/_`; pre-commit runs lint-staged followed by typecheck. No commit was created.
- `npm audit`: zero vulnerabilities after removing the one-off audit tool from project dependencies.

## Browser Checks

Verified in the Codex browser at 320, 393, 768, 1440, and 1920px viewport widths. The browser uses a visible scrollbar, so available content width can be 15px narrower than the requested viewport.

- No page-level horizontal overflow or overflowing headings at these widths.
- Project images load; next/previous controls reach both gallery boundaries and disable correctly. The source design intentionally repeats the Web3 image.
- Desktop career tabs switch between all four roles. Arrow keys, Home, and End move tab selection and focus.
- Mobile displays all four career entries and all four projects vertically without clipped text.
- Skill hover uses the active Figma variant; the unchanged default is available on touch devices.
- People, Impact, Products, and the cover routes render the corresponding supplied designs.
- Contact links use the supplied email and telephone number.
- No browser console errors observed during the final interaction check.

Local screenshots: `artifacts/desktop.png`, `artifacts/mobile.png`. Screenshots are review artifacts, not committed application assets.

## Lighthouse

Measured against `next start` at `http://127.0.0.1:3100`, not the development server. Lighthouse 12.6.1, headless Chrome, default mobile simulated throttling.

| Profile | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------: | ------------: | -------------: | --: |
| Mobile  |          97 |           100 |            100 | 100 |
| Desktop |         100 |           100 |            100 | 100 |

Mobile metrics: FCP 0.8s, LCP 1.9s, total blocking time 10ms, cumulative layout shift 0.

Raw reports are in `artifacts/lighthouse-mobile-final.report.html` / `.json` and `artifacts/lighthouse-desktop-final.report.html` / `.json`. `artifacts/` is ignored by Git. To reproduce the mobile audit while the production server is running:

```bash
npx --yes lighthouse@12.6.1 http://127.0.0.1:3100 --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=./lighthouse-report.html
```

Lighthouse is a one-off measurement tool, not an application dependency. Scores are local lab results, not a guarantee for deployment, other devices, or future animation changes.

## Intentional Differences And Remaining Inputs

- Gray body text is slightly darker than Figma for readability. The final career card uses `#6163e8` instead of `#6366f1` and white body text to meet text contrast requirements. The main palette and original assets are preserved.
- The site adapts layout in normal document flow rather than using Figma's absolute page coordinates. This prevents overlapping text at intermediate widths.
- Desktop has accessible gallery arrows and career tabs so every item can be inspected before animations are implemented. No autoplay, scroll animation, or full-screen transition has been added.
- CV, Behance, and LinkedIn destinations were not present in Figma and have not been supplied. Their buttons remain disabled, with explicit accessible labels, until `profileLinks` is populated.
- No real CV was generated, no case studies were invented, and nothing was deployed. Set `NEXT_PUBLIC_SITE_URL` to the final domain before deployment.
- The layout is tested in Chromium; Safari and Firefox have not been separately tested.
