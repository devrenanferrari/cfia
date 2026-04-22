# CFIA Website UI Kit

Public marketing + learner experience for cfia.com.br. Recreated from the Next.js codebase at `devrenanferrari/cfia`. Carbon-aligned. No shadows, no radius, one blue accent.

## Files

- `index.html` — click-thru prototype covering 4 screens: **Home**, **Cursos** (catalog), **Curso detalhe** (PDP), **Dashboard**.
- `Navbar.jsx` — sticky Gray-100 nav with active-underline links, search, user menu.
- `Footer.jsx` — Gray-100 footer, hairline columns, social chips.
- `Hero.jsx` — white→blue-10 diagonal wash, eyebrow pill, portrait + floating Carbon badges.
- `TrackGrid.jsx` — 4-column IBM tile grid with blue-10 icon swatches and ghost CTAs.
- `CourseCard.jsx` — thumbnail + 16:9, badge, rating, price. Hairline grid host.
- `CoursesCatalog.jsx` — filters rail + results grid.
- `CourseDetail.jsx` — hero, instructor, syllabus accordion, enroll panel.
- `Dashboard.jsx` — learner home, in-progress courses, progression chart.
- `CTABand.jsx`, `SectionHeader.jsx`, `Stat.jsx` — small shared atoms.

## Screen routes (prototype nav)

- `/` Home
- `/cursos` Catalog
- `/cursos/fundamentos-ml` Detail
- `/dashboard` Learner dashboard

Click anywhere on nav, track tiles, course cards, or CTA buttons to move between screens.
