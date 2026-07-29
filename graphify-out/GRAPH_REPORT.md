# Graph Report - gosbros  (2026-06-22)

## Corpus Check
- 33 files · ~90,809 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 160 nodes · 189 edges · 21 communities (15 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 4% INFERRED · 1% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `564454e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Portfolio Pages & Components|Portfolio Pages & Components]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Gosbros Brand Identity|Gosbros Brand Identity]]
- [[_COMMUNITY_UI Design System|UI Design System]]
- [[_COMMUNITY_Layout & Fonts|Layout & Fonts]]
- [[_COMMUNITY_CMS & Admin|CMS & Admin]]
- [[_COMMUNITY_Next.js Scaffolding|Next.js Scaffolding]]
- [[_COMMUNITY_Brand Identities|Brand Identities]]
- [[_COMMUNITY_Site Assets & Icons|Site Assets & Icons]]
- [[_COMMUNITY_OpenCode Plugin|OpenCode Plugin]]
- [[_COMMUNITY_Architecture Projects|Architecture Projects]]
- [[_COMMUNITY_Agent Configuration|Agent Configuration]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Example Page|Example Page]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 21 edges
2. `compilerOptions` - 16 edges
3. `GOSBROS` - 9 edges
4. `scripts` - 5 edges
5. `Website Builder Skill` - 5 edges
6. `Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site` - 5 edges
7. `Gosbros Logo SVG` - 5 edges
8. `Gosbros Logo SVG (public copy)` - 5 edges
9. `Branding Project 01 Image` - 3 edges
10. `Brand Identity Mockup — asymmetric grids, monochrome palette, brutalist typography` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site` --conceptually_related_to--> `Hero.tsx - Hero section component with Vimeo video background and animated text`  [AMBIGUOUS]
  gosbrosters.com/public/Hero_Placeholder.jpg → gosbrosters.com/src/components/Hero.tsx
- `Soviet Bus Stop Metaphor` --rationale_for--> `GOSBROS`  [INFERRED]
  gosbrosters.com/brand_voice.md → DESIGN.md
- `Next.js Project` --conceptually_related_to--> `Next.js`  [INFERRED]
  gosbrosters.com/README.md → .opencode/skill/website-builder/SKILL.md
- `Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site` --references--> `Don Molinico project - Packaging & Branding for FMCG, uses Hero_Placeholder as project image`  [EXTRACTED]
  gosbrosters.com/public/Hero_Placeholder.jpg → gosbrosters.com/src/data/projects.json
- `Gosbros Logo SVG` --identical_copy--> `Gosbros Logo SVG (public copy)`  [EXTRACTED]
  gosbros logo.svg → gosbrosters.com/public/gosbros-logo.svg

## Import Cycles
- None detected.

## Communities (21 total, 6 thin omitted)

### Community 0 - "Portfolio Pages & Components"
Cohesion: 0.14
Nodes (18): AboutPage(), AdminPage(), ContentBlock, Home(), ArchivePage(), FilterType, Footer(), Hero() (+10 more)

### Community 1 - "Project Dependencies"
Cohesion: 0.13
Nodes (14): dependencies, framer-motion, next, react, react-dom, @vercel/blob, name, private (+6 more)

### Community 2 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Gosbros Brand Identity"
Cohesion: 0.15
Nodes (14): Gosbros Brand, White Fill Color, Gosbros Logo SVG, Rounded Rectangle Badge Shape, Logo Text 'Gosbros', Custom SVG Path Typography, Wordmark Logo, Gosbros Brand (+6 more)

### Community 4 - "UI Design System"
Cohesion: 0.17
Nodes (12): Auge Design, Bilingual ES/EN, Color Palette, Component Patterns, Custom Cursor, GOSBROS, Roboto Flex, Spacing Scale (+4 more)

### Community 5 - "Layout & Fonts"
Cohesion: 0.20
Nodes (6): interLogo, metadata, robotoFlexDisplay, robotoFlexSans, robotoFlexSerif, LanguageProvider()

### Community 6 - "CMS & Admin"
Cohesion: 0.38
Nodes (7): Local CMS system - zero database, file-based portfolio management with image upload API, GOSBROS creative studio brand - brutalist, monochrome, minimalist design aesthetic, Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site, Default fallback image - likely a neutral/blank placeholder graphic used when no real image is uploaded, Hero.tsx - Hero section component with Vimeo video background and animated text, projects.json - Portfolio projects data (Casa Brutale, Auge Design, Don Molinico, Via Publica, Estudio Cero), Don Molinico project - Packaging & Branding for FMCG, uses Hero_Placeholder as project image

### Community 7 - "Next.js Scaffolding"
Cohesion: 0.25
Nodes (8): create-next-app, Next.js Project, Next.js, pattern-detector, shadcn/ui, spec-analyzer, Tailwind CSS, Website Builder Skill

### Community 8 - "Brand Identities"
Cohesion: 0.47
Nodes (6): Auge Design Brand Identity, GOSBROS Brand, Branding Project 01 Image, GOSBROS Design System — monochrome palette, Roboto Flex, rectilinear, Estudio Cero Brand Identity, Brand Identity Mockup — asymmetric grids, monochrome palette, brutalist typography

### Community 9 - "Site Assets & Icons"
Cohesion: 0.33
Nodes (6): document/file icon, globe icon, Next.js logo, gosbrosters.com project root, Vercel logo, window icon

### Community 11 - "Architecture Projects"
Cohesion: 0.67
Nodes (3): Casa Brutale project — exposed concrete, recycled steel, modular residential architecture, Architecture Remodel Project Image, Vía Pública project — modular urban furniture, raw pine, public space activation

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

## Ambiguous Edges - Review These
- `Branding Project 01 Image` → `Brand Identity Mockup — asymmetric grids, monochrome palette, brutalist typography`  [AMBIGUOUS]
  gosbrosters.com/public/Branding_Project_01.jpg · relation: conceptually_related_to
- `Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site` → `Hero.tsx - Hero section component with Vimeo video background and animated text`  [AMBIGUOUS]
  gosbrosters.com/src/components/Hero.tsx · relation: conceptually_related_to

## Knowledge Gaps
- **82 isolated node(s):** `ContentBlock`, `@opencode-ai/plugin`, `eslintConfig`, `nextConfig`, `name` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Branding Project 01 Image` and `Brand Identity Mockup — asymmetric grids, monochrome palette, brutalist typography`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Hero_Placeholder image - 1024x1024 placeholder graphic for GOSBROS portfolio site` and `Hero.tsx - Hero section component with Vimeo video background and animated text`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `Community 20` to `Project Dependencies`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `ContentBlock`, `@opencode-ai/plugin`, `eslintConfig` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio Pages & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13825757575757575 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._