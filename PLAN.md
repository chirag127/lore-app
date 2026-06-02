# KnowledgeAtlas — Master Plan

**Goal:** Every leaf directory → 10+ books (253 leaves × 10 = 2,530 books).
**Current:** 171 leaves have ≥1 book (total 647 books). **Remaining:** 1,883 books to generate.
**Method:** One book per sub-agent (dedicated `task()`), thorough web research for every aspect.
**Verify:** `pnpm typecheck` after every book batch.
**Commit:** Individual books or small batches; clean git history.

---

## Current State

| Metric | Count |
|---|---|
| Leaves (subcategories) | 253 |
| Leaves with ≥1 book | 171 |
| Truly empty leaves | 82 |
| Total existing books | 647 |
| Target books needed (253 × 10) | 2,530 |
| Books remaining | 1,883 |
| Completion | ~25.6% |

### Per-Category Book Deficit

Sorted by priority (01 through 32). Total leaves: 253. Total books: 647. Total need: 1,883 books (10 per leaf minus existing).

| # | Category | Leaves | Filled | Empty | Books | Need (×10) |
|---|---|---|---|---|---|---|
| 01 | Health & Longevity | 6 | 4 | 2 | 5 | **55** |
| 02 | Medicine & Health Sci | 7 | 5 | 2 | 6 | **64** |
| 03 | Biology & Life Sci | 1 | 0 | 1 | 0 | **10** |
| 04 | Self-Help | 8 | 6 | 2 | 7 | **73** |
| 05 | Productivity (Perf) | 7 | 5 | 2 | 29 | **41** |
| 06 | Productivity (Gen) | 1 | 1 | 0 | 2 | **8** |
| 07 | Decision / Systems | 9 | 7 | 2 | 21 | **69** |
| 08 | Psychology | 15 | 12 | 3 | 36 | **114** |
| 09 | Philosophy | 12 | 12 | 0 | 40 | **80** |
| 10 | Religion & Spir. | 7 | 5 | 2 | 8 | **62** |
| 11 | Finance & Investing | 14 | 11 | 3 | 75 | **65** |
| 12 | Business & Mgmt | 11 | 7 | 4 | 42 | **68** |
| 13 | Economics | 8 | 6 | 2 | 12 | **68** |
| 14 | Comm / Lang / Ling | 8 | 4 | 4 | 12 | **68** |
| 15 | Education | 6 | 4 | 2 | 10 | **50** |
| 16 | Social Sciences | 7 | 6 | 1 | 7 | **63** |
| 17 | Law | 6 | 6 | 0 | 6 | **54** |
| 18 | History | 9 | 9 | 0 | 29 | **61** |
| 19 | Political Science | 7 | 3 | 4 | 24 | **46** |
| 20 | Pure Sciences | 9 | 8 | 1 | 23 | **67** |
| 21 | Nature / Ecology | 4 | 3 | 1 | 13 | **27** |
| 22 | Mathematics | 9 | 7 | 2 | 44 | **46** |
| 23 | Computer Science | 12 | 11 | 1 | 33 | **87** |
| 24 | Software Eng | 9 | 8 | 1 | 37 | **53** |
| 25 | AI / ML | 8 | 4 | 4 | 10 | **70** |
| 26 | Tech / Engineering | 8 | 4 | 4 | 4 | **76** |
| 27 | Biography / Memoir | 11 | 7 | 4 | 8 | **102** |
| 28 | Fiction | 11 | 5 | 6 | 6 | **104** |
| 29 | Poetry / Drama | 3 | 1 | 2 | 1 | **29** |
| 30 | Music / Film | 3 | 1 | 2 | 10 | **20** |
| 31 | Art / Design | 4 | 1 | 3 | 12 | **28** |
| 32 | Literary Crit | 3 | 1 | 2 | 10 | **20** |
| | **TOTAL** | **253** | **171** | **82** | **647** | **1,883** |

## Book File Package — Complete Specification

### FILE 1: `index.mdx` — Book Overview & Metadata

**Frontmatter fields:**
```yaml
---
title: "Full Book Title"
slug: "book-slug-author-name"
author: ["Author Name"]
year: YYYY
category: "Category Name"
subcategory: "Subcategory Name"
excerpt: "One-sentence summary of the book's core contribution"
cover:
  url: "https://covers.openlibrary.org/b/isbn/ISBN13-L.jpg"
  color: "#HEXCOLOR"
keyIdeas:
  - "First key idea"
  - "Second key idea"
  - "Third key idea"
  - "Fourth key idea"
keyTakeaways:
  - "First takeaway"
  - "Second takeaway"
  - "Third takeaway"
  - "Fourth takeaway"
whoShouldRead:
  - "Reader type 1"
  - "Reader type 2"
  - "Reader type 3"
whoShouldSkip:
  - "Reader type to skip"
  - "Another to skip"
relatedBooks:
  - "slug-of-related-book-1"
  - "slug-of-related-book-2"
  - "slug-of-related-book-3"
tags:
  - "tag1"
  - "tag2"
  - "tag3"
  - "tag4"
  - "tag5"
addedAt: "2026-06-09"
---
```

**Body:** 2-3 sentence intro paragraph explaining why this book matters, then:
```
<BookHeader />
```

**Cover URL convention:** Use Open Library with ISBN. Verify ISBN via web search.

---

### FILE 2: `01-content.mdx` — Comprehensive Book Summary

**Length:** 2000-3000 words (flexible — can be 4000+ for dense books).

**Structure:**
```
## Chapter/Part 1 Title
... summary of content, key arguments, examples, case studies ...

## Chapter/Part 2 Title
... continue for all major parts ...

## Reading Guide

### Sufficiency Assessment
Does this summary capture the book's core thesis? What does it miss?

### Recommended Reading Path
| Reader Type | Time | What to Read |
|---|---|---|
| Casual | ~15 min | This summary |
| Interested | ~2-4 hr | Summary + Chapters X, Y, Z |
| Scholar/Practitioner | ~10-15 hr | Full book |

### Chapters to Read in Full (if not reading the whole book)
- **Chapter 1** — Why it's essential

### Chapters to Skim or Skip
- **Chapter 2** — Background context, skimmable

### What You'll Miss by Not Reading the Full Book
- Nuance, rich examples, counter-arguments
```

**Must cover:** All major concepts, arguments, examples, case studies.
**Last section MUST be:** `## Reading Guide`.

---

### FILE 3: `02-analysis.mdx` — Comprehensive Critical Analysis

**Length:** 2000-4000 words. This is the most important file.

**Required 11 sections (in order):**

1. `## Book Context & Background` — When published, what conversation it responded to, dominant paradigm before
2. `## About the Author` — Credentials, biases, intellectual background, other works
3. `## Core Thesis & Argument` — Single most important claim, how structured, supporting pillars
4. `## Thematic Analysis` — 3-5 major themes, evidence used, convincingness; use specific examples
5. `## Argumentation & Evidence` — Types of evidence (anecdotes, data, case studies), rigor, gaps
6. `## Strengths` — 3-5 specific strengths referencing chapters/passages
7. `## Criticisms & Weaknesses` — 3-6 REAL criticisms from NAMED reviewers/scholars
8. `## Comparative Analysis` — Similar works, what it builds on/challenges
9. `## Impact & Legacy` — Reception, influence, aging, updated editions
10. `## Reading Recommendation` — Four reader profiles table
11. `## Summary Sufficiency` — Rate accuracy (1-10) and completeness (1-10)

---

### FILE 4: `03-narration.mdx` — Narrative & Writing Style

**Length:** 500-1000 words.

1. **Writing Style & Voice** — Prose style, vocabulary, metaphor/analogy
2. **Narrative Structure** — Organization, storytelling vs data, tension
3. **Rhetorical Techniques** — Ethos/pathos/logos, framing, memorable phrases
4. **Readability & Accessibility** — Reading level, technical terms explained
5. **Comparative Context** — Fits in oeuvre, genre comparison, uniqueness

---

### FILE 5: `meta.json` — Structured Metadata

```json
{
  "id": "book-slug-author-name",
  "title": "Full Book Title",
  "slug": "book-slug-author-name",
  "authors": ["Author Full Name"],
  "year": YYYY,
  "category": "Category Name",
  "subcategory": "Subcategory Name",
  "pages": NNN,
  "isbn": "978XXXXXXXXXXXXX",
  "language": "en",
  "genres": ["Primary Genre", "Secondary Genre"],
  "source": "generated",
  "generatedAt": "2026-06-09"
}
```

---

## Research Methodology — 7 Required Areas per Book

**Every book sub-agent MUST independently search each area:**

### 1. Metadata
- `"[book]" year published isbn pages` → verify on Wikipedia/Open Library
### 2. Summary & Table of Contents
- `"[book]" summary chapter breakdown table of contents`
### 3. Key Concepts & Arguments
- `"[book]" key concepts arguments main ideas`
### 4. Critical Reception (REAL critics)
- `"[book]" review criticism weaknesses controversy`
- `"[book]" scholarly critique` — minimum 3 named critics
### 5. Author Background
- `"[author]" biography background career writing style`
### 6. Impact & Influence
- `"[book]" impact legacy influence how it changed`
### 7. Related Books
- `"books similar to [book]"`

**Never fabricate. Never guess. Every data point needs a source.**

---

## Per-Directory Book Recommendations (762 leaves × 10 books)

### BATCH 0: EMERGENCY FILL — 54 Empty Leaves First

*These directories have ZERO books. Generate 10 each immediately.*

#### 22-mathematics-statistics (17 empty)

**algebra-and-number-theory/a-course-in-arithmetic-jean-pierre-serre**
1. A Course in Arithmetic — Jean-Pierre Serre (1973)
2. Number Theory — George E. Andrews (1971)
3. An Introduction to the Theory of Numbers — Niven, Zuckerman, Montgomery (1960)
4. Elementary Number Theory — David Burton (1976)
5. A Classical Introduction to Modern Number Theory — Ireland & Rosen (1972)
6. Problems in Algebraic Number Theory — Murthy, Esmonde (1999)
7. Rational Points on Elliptic Curves — Silverman & Tate (1992)
8. Algebraic Number Theory and Fermat's Last Theorem — Stewart & Tall (1979)
9. Prime Numbers: A Computational Perspective — Crandall & Pomerance (2000)
10. Introduction to Modular Forms — Serge Lang (1976)

**algebra-and-number-theory/algebra-serge-lang**
1. Algebra — Serge Lang (1965/2002)
2. Basic Algebra I — Nathan Jacobson (1974)
3. Basic Algebra II — Nathan Jacobson (1980)
4. Algebra: Chapter 0 — Paolo Aluffi (2009)
5. Abstract Algebra — David S. Dummit & Richard M. Foote (1991)
6. A First Course in Abstract Algebra — John B. Fraleigh (1967)
7. Contemporary Abstract Algebra — Joseph A. Gallian (1986)
8. Algebra: A Graduate Course — Martin Isaacs (1993)
9. Advanced Modern Algebra — Joseph J. Rotman (2002)
10. Algebra — Michael Artin (1991)

**algebra-and-number-theory/algebraic-number-theory-jurgen-neukirch**
1. Algebraic Number Theory — Jürgen Neukirch (1992)
2. Algebraic Number Theory — Serge Lang (1970)
3. Algebraic Number Theory — James Milne (1997/online)
4. Number Theory: Algebraic Numbers and Functions — Helmut Koch (2000)
5. Primes of the Form x² + ny² — David Cox (1989)
6. A Brief Guide to Algebraic Number Theory — Swinnerton-Dyer (2001)
7. Algebraic Number Theory and Fermat's Last Theorem — Stewart & Tall (1979)
8. Introduction to Cyclotomic Fields — Lawrence Washington (1982)
9. Class Field Theory — Jürgen Neukirch (1986)
10. Local Fields — Jean-Pierre Serre (1962)

**algebra-and-number-theory/categories-for-working-mathematician-saunders-mac-lane**
1. Categories for the Working Mathematician — Saunders Mac Lane (1971)
2. Basic Category Theory — Tom Leinster (2014)
3. Category Theory in Context — Emily Riehl (2016)
4. Conceptual Mathematics — Lawvere & Schanuel (1997)
5. Category Theory — Steve Awodey (2006)
6. Handbook of Categorical Algebra — Francis Borceux (1994)
7. Sheaves in Geometry and Logic — Mac Lane & Moerdijk (1992)
8. An Introduction to Category Theory — Harold Simmons (2011)
9. Category Theory for the Sciences — David Spivak (2014)
10. Quiver Representations — Ralf Schiffler (2014)

**algebra-and-number-theory/elliptic-curves-joseph-silverman**
1. The Arithmetic of Elliptic Curves — Joseph Silverman (1986)
2. Rational Points on Elliptic Curves — Silverman & Tate (1992)
3. Elliptic Curves: Number Theory and Cryptography — Lawrence Washington (2003)
4. Advanced Topics in the Arithmetic of Elliptic Curves — Silverman (1994)
5. Elliptic Curves — Dale Husemöller (1987)
6. A Friendly Introduction to Number Theory — Joseph Silverman (1997)
7. Introduction to Elliptic Curves and Modular Forms — Neal Koblitz (1984)
8. Elliptic Curves and Their Applications to Cryptography — Andreas Enge (1999)
9. Elliptic Tales — Avner Ash & Robert Gross (2012)
10. The Arithmetic of Elliptic Curves (2/e) — Joseph Silverman (2009)

**algebra-and-number-theory/galois-theory-ian-stewart**
1. Galois Theory — Ian Stewart (1973)
2. Galois Theory — Joseph Rotman (1990)
3. Fields and Galois Theory — John M. Howie (2000)
4. Galois Theory for Beginners — Jörg Bewersdorff (2004)
5. Algebra and Galois Theory — John R. Swallow (2004)
6. Galois Theory Through Exercises — Brzezinski (2017)
7. Abstract Algebra and Solution by Radicals — John E. Maxfield (1971)
8. Galois' Dream — Michio Kuga (1993)
9. Galois Theory and Its Algebraic Background — D. J. H. Garling (1986)
10. A Classical Introduction to Galois Theory — Stephen C. Newman (2012)

**algebra-and-number-theory/introduction-to-theory-of-numbers-hardy-wright**
1. An Introduction to the Theory of Numbers — Hardy & Wright (1938)
2. Elementary Number Theory — David M. Burton (1976)
3. Number Theory — George Andrews (1971)
4. A Friendly Introduction to Number Theory — Joseph Silverman (1997)
5. Elementary Number Theory and Its Applications — Kenneth Rosen (1984)
6. Number Theory: Structures, Examples, and Problems — Andreescu & Andrica (2009)
7. 104 Number Theory Problems — Andreescu, Andrica, Feng (2006)
8. The Theory of Numbers — Niven, Zuckerman, Montgomery (1960)
9. Problems from the Book — Andreescu & Dospinescu (2008)
10. Number Theory: Step by Step — Kuldeep Singh (2020)

**algebra-and-number-theory/representation-theory-fulton-harris**
1. Representation Theory: A First Course — Fulton & Harris (1991)
2. Linear Representations of Finite Groups — Jean-Pierre Serre (1971)
3. Introduction to Representation Theory — Etingof et al. (2009)
4. Characters of Finite Groups — Feit, Walter (1967)
5. Group Representation Theory — Larry Dornhoff (1971)
6. Representation Theory of Finite Groups — Benjamin Steinberg (2012)
7. The Representation Theory of the Symmetric Group — James & Kerber (1981)
8. Representations and Characters of Groups — James & Liebeck (1993)
9. A Course in Group Theory — John F. Humphreys (1996)
10. Finite Group Theory — I. Martin Isaacs (2008)

**analysis-and-calculus/calculus-michael-spivak**
1. Calculus — Michael Spivak (1967)
2. Calculus: Early Transcendentals — James Stewart (1987)
3. Calculus Made Easy — Silvanus P. Thompson (1910)
4. Infinite Powers — Steven Strogatz (2019)
5. A Tour of the Calculus — David Berlinski (1995)
6. The Calculus Lifesaver — Adrian Banner (2007)
7. Calculus on Manifolds — Michael Spivak (1965)
8. Understanding Analysis — Stephen Abbott (2001)
9. Calculus, Volume I — Tom Apostol (1961)
10. Advanced Calculus — Patrick Fitzpatrick (1995)

**analysis-and-calculus/complex-analysis/complex-analysis-lars-ahlfors**
1. Complex Analysis — Lars Ahlfors (1953)
2. Complex Variables and Applications — Churchill & Brown (1948)
3. Visual Complex Analysis — Tristan Needham (1997)
4. Complex Analysis — Serge Lang (1977)
5. Complex Analysis: An Introduction — Rolf Nevanlinna (1953)
6. Functions of One Complex Variable — John B. Conway (1973)
7. Complex Analysis: A First Course — S. Ponnusamy (2000)
8. Complex Analysis: The Argument Principle — Polya & Latta (1974)
9. Complex Analysis with Applications — Asmar & Grafakos (2018)
10. Complex Analysis Through Examples and Exercises — Endre Pap (1999)

**analysis-and-calculus/complex-analysis/visual-complex-analysis-tristan-needham**
1. Visual Complex Analysis — Tristan Needham (1997)
2. Complex Analysis — Lars Ahlfors (1953)
3. Visual Differential Geometry and Forms — Tristan Needham (2021)
4. The Symmetry of Chaos — Field & Golubitsky (1992)
5. Complex Variables — Stephen D. Fisher (1986)
6. Indra's Pearls — Mumford, Series, Wright (2002)
7. Visual Group Theory — Nathan Carter (2009)
8. The Visual Display of Quantitative Information — Edward Tufte (1983)
9. Geometry and the Imagination — Hilbert & Cohn-Vossen (1932)
10. Mathematics and Its History — John Stillwell (1989)

**analysis-and-calculus/differential-equations-and-dynamical-systems/ordinary-differential-equations-vladimir-arnold**
1. Ordinary Differential Equations — Vladimir Arnold (1973)
2. Differential Equations and Their Applications — Martin Braun (1975)
3. Nonlinear Dynamics and Chaos — Steven Strogatz (1994)
4. Differential Equations, Dynamical Systems, and Linear Algebra — Hirsch & Smale (1974)
5. Ordinary Differential Equations — Earl Coddington (1955)
6. Differential Equations — Blanchard, Devaney, Hall (1998)
7. A First Course in Differential Equations — Dennis Zill (1979)
8. Ordinary Differential Equations — Jack Hale (1969)
9. Differential Equations and Dynamical Systems — Perko (1991)
10. Lectures on Ordinary Differential Equations — Witold Hurewicz (1958)

**analysis-and-calculus/differential-equations-and-dynamical-systems/partial-differential-equations-lawrence-evans**
1. Partial Differential Equations — Lawrence Evans (1998)
2. Partial Differential Equations I & II — Michael Taylor (1996)
3. PDEs: An Introduction — Walter Strauss (1992)
4. Partial Differential Equations — Fritz John (1971)
5. Introduction to PDEs — David Borthwick (2016)
6. PDEs: Methods and Applications — Robert McOwen (1996)
7. Applications of Lie Groups to Differential Equations — Peter Olver (1986)
8. Elementary Partial Differential Equations — Paul Berg & James McGregor (1966)
9. Partial Differential Equations — Jürgen Jost (2002)
10. Numerical Solution of PDEs — Morton & Mayers (1994)

**analysis-and-calculus/fourier-analysis-stein-shakarchi**
1. Fourier Analysis — Stein & Shakarchi (2003)
2. Fourier Series and Boundary Value Problems — Churchill & Brown (1941)
3. The Fourier Transform and Its Applications — Ronald Bracewell (1965)
4. Fourier Analysis on Groups — Walter Rudin (1960)
5. Introduction to Fourier Analysis on Euclidean Spaces — Stein & Weiss (1971)
6. Complex Analysis (for Fourier methods) — Stein & Shakarchi (2003)
7. Harmonic Analysis: Real-Variable Methods — Stein (1993)
8. A First Course in Fourier Analysis — David Kammler (2000)
9. Fourier Series — Georgi Tolstov (1962)
10. Discrete-Time Signal Processing — Oppenheim & Schafer (1989)

**analysis-and-calculus/functional-analysis-walter-rudin**
1. Functional Analysis — Walter Rudin (1973)
2. Functional Analysis — Kreyzig (1978)
3. Introduction to Functional Analysis — Kreyszig (1978)
4. Linear Operators, Parts I-III — Dunford & Schwartz (1958)
5. A Course in Functional Analysis — John Conway (1985)
6. Principles of Functional Analysis — Martin Schechter (1971)
7. Functional Analysis: An Introduction — Eidelman, Milman, Tsolomitis (2004)
8. Banach Space Theory — Fabian et al. (2001)
9. C*-Algebras by Example — Kenneth Davidson (1996)
10. Operator Theory — Carlos S. Kubrusly (2003)

**analysis-and-calculus/introduction-to-calculus-and-analysis-richard-courant**
1. Introduction to Calculus and Analysis, Vol I & II — Courant & John (1965)
2. Differential and Integral Calculus, Vol I & II — Richard Courant (1934)
3. Calculus — Michael Spivak (1967)
4. What is Mathematics? — Courant & Robbins (1941)
5. Calculus, Vol I — Tom Apostol (1961)
6. Calculus, Vol II — Tom Apostol (1962)
7. Advanced Calculus — Lynn Loomis & Shlomo Sternberg (1968)
8. A Course of Modern Analysis — Whittaker & Watson (1902)
9. Methods of Mathematical Physics Vol I — Courant & Hilbert (1924)
10. Supersonic Flow and Shock Waves — Courant & Friedrichs (1944)

**analysis-and-calculus/real-analysis-and-measure-theory/real-analysis-h-l-royden**
1. Real Analysis — H.L. Royden (1963)
2. Real Analysis: Modern Techniques and Their Applications — Folland (1984)
3. Principles of Mathematical Analysis — Walter Rudin (1953)
4. Real and Complex Analysis — Walter Rudin (1966)
5. Measure Theory and Integration — Michael Taylor (2006)
6. Real Analysis — Stein & Shakarchi (2005)
7. Measure and Integral — Wheeden & Zygmund (1977)
8. Real Analysis: A First Course — Serge Lang (1969)
9. Real Analysis and Probability — R.M. Dudley (1984)
10. Counterexamples in Analysis — Gelbaum & Olmsted (1964)

**geometry-and-topology/algebraic-topology**

*(Already has 1 book — need 9 more)*
2. Algebraic Topology — Allen Hatcher (2002)
3. Topology — James Munkres (1975)
4. Algebraic Topology: A First Course — Marvin Greenberg (1967)
5. A Basic Course in Algebraic Topology — William Massey (1991)
6. Elements of Algebraic Topology — James Munkres (1984)
7. Homology Theory — Vick (1973)
8. Algebraic Topology: An Introduction — William Massey (1967)
9. Simplicial Homotopy Theory — Goerss & Jardine (1999)
10. Differential Forms in Algebraic Topology — Bott & Tu (1982)

**geometry-and-topology/differential-geometry**

**(need 9 more)**
2. Differential Geometry of Curves and Surfaces — Manfredo do Carmo (1976)
3. Riemannian Geometry — Manfredo do Carmo (1992)
4. A Comprehensive Introduction to Differential Geometry, Vol 1-5 — Spivak (1970)
5. Introduction to Smooth Manifolds — John M. Lee (2002)
6. Riemannian Manifolds — John M. Lee (1997)
7. Differential Geometry in the Large — Heinz Hopf (1956)
8. The Geometry of Geodesics — Herbert Busemann (1955)
9. Lecture Notes on Differential Geometry — Chern, Chen, Lam (1999)
10. Curvature in Mathematics and Physics — Shlomo Sternberg (2012)

**geometry-and-topology/euclidean-and-non-euclidean-geometry**

**(need 9 more)**
2. Euclidean and Non-Euclidean Geometries — Marvin Greenberg (1974)
3. Geometry: A Comprehensive Course — Dan Pedoe (1970)
4. Introduction to Geometry — H.S.M. Coxeter (1961)
5. Geometry Revisited — Coxeter & Greitzer (1967)
6. Non-Euclidean Geometry — Roberto Bonola (1912)
7. The Poincaré Half-Plane — Saul Stahl (1993)
8. Projective Geometry — H.S.M. Coxeter (1963)
9. Geometry and the Imagination — Hilbert & Cohn-Vossen (1932)
10. A Simple Non-Euclidean Geometry and Its Physical Basis — Yaglom (1979)

#### 20-pure-sciences (10 empty)

**astronomy-astrophysics-cosmology/cosmology-and-origin-of-universe/cosmos-carl-sagan**
1. Cosmos — Carl Sagan (1980)
2. A Brief History of Time — Stephen Hawking (1988)
3. The First Three Minutes — Steven Weinberg (1977)
4. Universe — William J. Kaufmann (1985)
5. The Cosmic Connection — Carl Sagan (1973)
6. Pale Blue Dot — Carl Sagan (1994)
7. The Elegant Universe — Brian Greene (1999)
8. Parallel Worlds — Michio Kaku (2004)
9. The Fabric of the Cosmos — Brian Greene (2004)
10. Big Bang — Simon Singh (2004)

**astronomy-astrophysics-cosmology/solar-system-and-planetary-science/cosmos-carl-sagan**
1. Cosmos — Carl Sagan (1980)
2. Pale Blue Dot — Carl Sagan (1994)
3. The Planets — Dava Sobel (2005)
4. Ice Worlds — Gomez & McCord (2007)
5. The Solar System — Michael Seeds (1987)
6. Planetary Sciences — de Pater & Lissauer (2001)
7. The New Solar System — Beatty, Petersen, Chaikin (1981)
8. Exploring the Planets — Eric H. Christiansen (1995)
9. Solar System Evolution — Stuart Ross Taylor (1992)
10. Moons: A Very Short Introduction — David Rothery (2015)

**chemistry/biochemistry-and-molecular-chemistry/the-disappearing-spoon-sam-kean**
1. The Disappearing Spoon — Sam Kean (2010)
2. The Periodic Table — Primo Levi (1975)
3. Napoleon's Buttons — Le Couteur & Burreson (2003)
4. Molecules — Theodore Gray (2008)
5. Uncle Tungsten — Oliver Sacks (2001)
6. Chemical Heritage — John Emsley (2000)
7. The Poisoner's Handbook — Deborah Blum (2010)
8. Elements: A Visual Exploration — Theodore Gray (2009)
9. Seven Elements That Changed the World — John Browne (2013)
10. The Chemistry of Alchemy — Cobb & Goldwhite (2002)

**evolutionary-biology/the-origin-of-species-charles-darwin**
1. On the Origin of Species — Charles Darwin (1859)
2. The Descent of Man — Charles Darwin (1871)
3. The Selfish Gene — Richard Dawkins (1976)
4. The Blind Watchmaker — Richard Dawkins (1986)
5. The Voyage of the Beagle — Charles Darwin (1839)
6. Evolution: The Triumph of an Idea — Carl Zimmer (2001)
7. The Beak of the Finch — Jonathan Weiner (1994)
8. Wonderful Life — Stephen Jay Gould (1989)
9. The Tangled Bank — Carl Zimmer (2009)
10. Darwin's Dangerous Idea — Daniel Dennett (1995)

**neuroscience/cognitive-neuroscience-and-decision-making/the-man-who-mistook-his-wife-for-a-hat-oliver-sacks**
1. The Man Who Mistook His Wife for a Hat — Oliver Sacks (1985)
2. The Tell-Tale Brain — V.S. Ramachandran (2010)
3. Phantoms in the Brain — V.S. Ramachandran (1998)
4. Musicophilia — Oliver Sacks (2007)
5. Awakenings — Oliver Sacks (1973)
6. An Anthropologist on Mars — Oliver Sacks (1995)
7. The Brain That Changes Itself — Norman Doidge (2007)
8. The Neurology of Being — Antonio Damasio (1999)
9. Descartes' Error — Antonio Damasio (1994)
10. Hallucinations — Oliver Sacks (2012)

**physics/classical-mechanics-and-thermodynamics/seven-brief-lessons-on-physics-carlo-rovelli**
1. Seven Brief Lessons on Physics — Carlo Rovelli (2014)
2. Reality Is Not What It Seems — Carlo Rovelli (2014)
3. The Order of Time — Carlo Rovelli (2017)
4. The Feynman Lectures on Physics, Vol I — Feynman (1963)
5. Classical Mechanics — Goldstein (1950)
6. Thermodynamics — Enrico Fermi (1936)
7. Heat and Thermodynamics — Zemansky (1937)
8. Six Easy Pieces — Richard Feynman (1994)
9. The Character of Physical Law — Richard Feynman (1965)
10. Seven Brief Lessons on Physics (expanded) — Rovelli (2015)

**physics/classical-mechanics-and-thermodynamics/the-feynman-lectures-vol-1-richard-feynman**
1. The Feynman Lectures on Physics, Vol I — Feynman (1963)
2. The Feynman Lectures on Physics, Vol II — Feynman (1964)
3. The Feynman Lectures on Physics, Vol III — Feynman (1965)
4. Classical Mechanics — Goldstein (1950)
5. Six Easy Pieces — Richard Feynman (1994)
6. Six Not-So-Easy Pieces — Richard Feynman (1997)
7. The Character of Physical Law — Richard Feynman (1965)
8. Surely You're Joking, Mr. Feynman! — Feynman (1985)
9. QED: The Strange Theory of Light and Matter — Feynman (1985)
10. The Meaning of It All — Richard Feynman (1998)

**physics/quantum-mechanics-and-quantum-field-theory/quantum-mechanics-landau-lifshitz**
1. Quantum Mechanics: Non-Relativistic Theory — Landau & Lifshitz (1958)
2. Principles of Quantum Mechanics — Dirac (1930)
3. Introduction to Quantum Mechanics — David J. Griffiths (1981)
4. Quantum Mechanics: Concepts and Applications — N. Zettili (2001)
5. Modern Quantum Mechanics — Sakurai (1985)
6. Lectures on Quantum Mechanics — Weinberg (2011)
7. Quantum Field Theory — Peskin & Schroeder (1995)
8. Quantum Mechanics — Sakurai (1994)
9. Quantum Mechanics — Liboff (1980)
10. The Quantum Theory of Fields, 3 Vols — Weinberg (1995)

**physics/quantum-mechanics-and-quantum-field-theory/something-deeply-hidden-sean-carroll**
1. Something Deeply Hidden — Sean Carroll (2019)
2. The Biggest Ideas in the Universe, Vol 1 — Sean Carroll (2022)
3. Quantum Mechanics and Experience — David Albert (1992)
4. The Quantum World — Kenneth Ford (2004)
5. Quantum: A Guide for the Perplexed — Jim Al-Khalili (2003)
6. Where Does the Weirdness Go? — David Lindley (1996)
7. The Quantum Universe — Cox & Forshaw (2011)
8. Spooky Action at a Distance — George Musser (2015)
9. Beyond Weird — Philip Ball (2018)
10. What Is Real? — Adam Becker (2018)

**physics/relativity-special-and-general/the-order-of-time-carlo-rovelli**
1. The Order of Time — Carlo Rovelli (2017)
2. Seven Brief Lessons on Physics — Carlo Rovelli (2014)
3. Reality Is Not What It Seems — Carlo Rovelli (2014)
4. A Brief History of Time — Stephen Hawking (1988)
5. The Nature of Space and Time — Hawking & Penrose (1996)
6. Gravitation — Misner, Thorne, Wheeler (1973)
7. Spacetime Physics — Taylor & Wheeler (1966)
8. Black Holes and Time Warps — Kip Thorne (1994)
9. General Relativity — Robert Wald (1984)
10. The Trouble with Time — Lee Smolin (2013)

#### 11-finance-investing (3 empty)

**alternative-investments/hedge-fund-strategies/more-money-than-god-sebastian-mallaby**
1. More Money Than God — Sebastian Mallaby (2010)
2. Hedge Fund Market Wizards — Jack Schwager (2012)
3. The New Market Wizards — Jack Schwager (1992)
4. The Man Who Solved the Market — Gregory Zuckerman (2019)
5. When Genius Failed — Roger Lowenstein (2000)
6. The Quants — Scott Patterson (2010)
7. A Demon of Our Own Design — Richard Bookstaber (2007)
8. Hedge Hogs — Barbara Dreyfuss (2013)
9. Inside the House of Money — Steven Drobny (2006)
10. The Invisible Hands — Steven Drobny (2011)

**quantitative-finance/algorithmic-trading-and-market-microstructure/flash-boys-michael-lewis**
1. Flash Boys — Michael Lewis (2014)
2. Liar's Poker — Michael Lewis (1989)
3. The Big Short — Michael Lewis (2010)
4. Algorithmic Trading — Ernest Chan (2009)
5. Automated Trading with R — Chris Conlan (2015)
6. Trading and Exchanges — Larry Harris (2003)
7. Market Microstructure Theory — Maureen O'Hara (1995)
8. High-Frequency Trading — Irene Aldridge (2009)
9. Broken Markets — Kevin McPartland (2019)
10. Dark Pools — Scott Patterson (2012)

**risk-management/fooled-by-randomness-nassim-taleb**
1. Fooled by Randomness — Nassim Taleb (2001)
2. The Black Swan — Nassim Taleb (2007)
3. Antifragile — Nassim Taleb (2012)
4. Skin in the Game — Nassim Taleb (2018)
5. Against the Gods — Peter Bernstein (1996)
6. The Logic of Failure — Dietrich Dörner (1989)
7. The Drunkard's Walk — Leonard Mlodinow (2008)
8. Risk: A Very Short Introduction — Baruch Fischhoff (2011)
9. Misbehaving — Richard Thaler (2015)
10. Nudge — Thaler & Sunstein (2008)

#### 18-history (1 empty)

**history-of-ideas-and-intellectual-history/the-structure-of-scientific-revolutions-thomas-kuhn**
1. The Structure of Scientific Revolutions — Thomas Kuhn (1962)
2. The Copernican Revolution — Thomas Kuhn (1957)
3. The Essential Tension — Thomas Kuhn (1977)
4. The Road Since Structure — Thomas Kuhn (2000)
5. Against Method — Paul Feyerabend (1975)
6. The Scientific Revolution — Steven Shapin (1996)
7. Leviathan and the Air-Pump — Shapin & Schaffer (1985)
8. Science and the Modern World — Alfred North Whitehead (1925)
9. The Sleepwalkers — Arthur Koestler (1959)
10. The Order of Things — Michel Foucault (1966)

#### 19-political-science-geopolitics (2 empty)

**geopolitics-and-great-power-competition/the-clash-of-civilizations-samuel-huntington** ✅ ALL 10 DONE
1. The Clash of Civilizations — Samuel Huntington (1996) ✅
2. Political Order in Changing Societies — Huntington (1968) ✅
3. The Soldier and the State — Huntington (1957) ✅
4. Who Are We? — Samuel Huntington (2004) ✅
5. The End of History and the Last Man — Francis Fukuyama (1992) ✅
6. The Great Divergence — Kenneth Pomeranz (2000) ✅
7. Orientalism — Edward Said (1978) ✅
8. The World Is Flat — Thomas Friedman (2005) ✅
9. Jihad vs. McWorld — Benjamin Barber (1995) ✅
10. The Lexus and the Olive Tree — Thomas Friedman (1999) ✅

**international-relations/the-tragedy-of-great-power-politics-john-mearsheimer**
1. The Tragedy of Great Power Politics — John Mearsheimer (2001)
2. The Israel Lobby — Mearsheimer & Walt (2007)
3. The Great Delusion — John Mearsheimer (2018)
4. The Origins of Alliances — Stephen Walt (1987)
5. Theory of International Politics — Kenneth Waltz (1979)
6. Man, the State, and War — Kenneth Waltz (1959)
7. The Anarchical Society — Hedley Bull (1977)
8. Politics Among Nations — Hans Morgenthau (1948)
9. After Hegemony — Robert Keohane (1984)
10. War and Change in World Politics — Robert Gilpin (1981)

#### 09-philosophy (11 empty)

**aesthetics/philosophy-of-art-and-aesthetic-experience**
1. Art as Experience — John Dewey (1934)
2. The Critique of Judgement — Immanuel Kant (1790)
3. Lectures on Aesthetics — Hegel (1835)
4. Art and Fear — David Bayles & Ted Orland (1993)
5. The Sense of Beauty — George Santayana (1896)
6. Ways of Seeing — John Berger (1972)
7. The Aesthetic Dimension — Herbert Marcuse (1977)
8. The Philosophy of Art — David Goldblatt (1976)
9. Art and Illusion — E.H. Gombrich (1960)
10. What Art Is — Arthur Danto (2013)

**aesthetics/philosophy-of-music-and-literature**
1. Music as Experience — John Dewey (1934)
2. Musicophilia — Oliver Sacks (2007)
3. This Is Your Brain on Music — Daniel Levitin (2006)
4. The Philosophy of Music — Peter Kivy (2004)
5. Music and the Mind — Anthony Storr (1992)
6. How Music Works — David Byrne (2012)
7. Literature and Philosophy — Richard Eldridge (2009)
8. The Mirror and the Lamp — M.H. Abrams (1953)
9. What Is Literature? — Jean-Paul Sartre (1947)
10. The Act of Reading — Wolfgang Iser (1976)

**eastern-philosophy/chinese-philosophy/the-tao-te-ching-lao-tzu**
1. Tao Te Ching — Lao Tzu (c. 500 BCE)
2. The Zhuangzi — Zhuang Zhou (c. 300 BCE)
3. The Analects — Confucius (c. 400 BCE)
4. The Art of War — Sun Tzu (c. 500 BCE)
5. The I Ching (Book of Changes) (c. 1000 BCE)
6. The Essential Confucius — Thomas Cleary (1992)
7. Chinese Thought: From Confucius to Mao — H. G. Creel (1953)
8. The Path: What Chinese Philosophers Can Teach Us — Michael Puett (2016)
9. Tao: The Watercourse Way — Alan Watts (1975)
10. The Tao of Physics — Fritjof Capra (1975)

**eastern-philosophy/japanese-philosophy/zen-in-the-art-of-archery-eugen-herrigel**
1. Zen in the Art of Archery — Eugen Herrigel (1948)
2. The Way of Zen — Alan Watts (1957)
3. Zen Mind, Beginner's Mind — Shunryu Suzuki (1970)
4. An Introduction to Zen Buddhism — D.T. Suzuki (1934)
5. The Art of Peace — Morihei Ueshiba (1992)
6. Hagakure — Yamamoto Tsunetomo (1716)
7. The Book of Tea — Kakuzo Okakura (1906)
8. Bushido: The Soul of Japan — Inazo Nitobe (1900)
9. Japanese Philosophy — James Heisig (2011)
10. The Zen Teaching of Huang Po — John Blofeld (1958)

**indian-philosophy/advaita-vedanta/the-essence-of-advaita-vedanta-swami-sivananda**
1. The Essence of Advaita Vedanta — Swami Sivananda (1942)
2. The Crest-Jewel of Wisdom — Shankaracharya (c. 800 CE)
3. Brahma Sutra Bhasya — Shankaracharya (c. 800 CE)
4. Vivekachudamani — Shankaracharya (c. 800 CE)
5. Drig-Drishya-Viveka — Shankaracharya (c. 800 CE)
6. Vedanta Treatise — Swami Paramananda (1940)
7. Atma Bodha — Shankaracharya (c. 800 CE)
8. The Upanishads — trans. Eknath Easwaran (1987)
9. I Am That — Nisargadatta Maharaj (1973)
10. The Gospel of Ramakrishna (1942)

**philosophy-of-mind-and-language/language-meaning-and-truth**
1. Philosophical Investigations — Ludwig Wittgenstein (1953)
2. Tractatus Logico-Philosophicus — Wittgenstein (1921)
3. The Concept of Mind — Gilbert Ryle (1949)
4. Speech Acts — John Searle (1969)
5. Meaning and Necessity — Rudolf Carnap (1947)
6. Logic and Conversation — H.P. Grice (1975)
7. Naming and Necessity — Saul Kripke (1972)
8. Word and Object — W.V.O. Quine (1960)
9. The Philosophy of Language — A.P. Martinich (1985)
10. Making It Explicit — Robert Brandom (1994)

**philosophy-of-mind-and-language/philosophy-of-perception**
1. The Problems of Philosophy — Bertrand Russell (1912)
2. Perception and the Physical World — D.M. Armstrong (1961)
3. The Senses Considered as Perceptual Systems — J.J. Gibson (1966)
4. The Ecological Approach to Visual Perception — J.J. Gibson (1979)
5. Vision Science — Stephen Palmer (1999)
6. Consciousness Explained — Daniel Dennett (1991)
7. The Conscious Mind — David Chalmers (1996)
8. The Representational Character of Experience — various (2000s)
9. Action in Perception — Alva Noë (2004)
10. The Phenomenology of Perception — Merleau-Ponty (1945)

**political-philosophy/justice-equality-and-rights**
1. A Theory of Justice — John Rawls (1971)
2. Anarchy, State, and Utopia — Robert Nozick (1974)
3. The Idea of Justice — Amartya Sen (2009)
4. Justice as Fairness — John Rawls (1985)
5. The Law of Peoples — John Rawls (1999)
6. Liberalism and the Limits of Justice — Michael Sandel (1982)
7. Spheres of Justice — Michael Walzer (1983)
8. The Rights of Man — Thomas Paine (1791)
9. The Second Treatise of Government — John Locke (1689)
10. Rights Talk — Mary Ann Glendon (1991)

**political-philosophy/liberalism-communitarianism-libertarianism**
1. Liberalism and the Limits of Justice — Michael Sandel (1982)
2. The Constitution of Liberty — F.A. Hayek (1960)
3. Liberalism — John Gray (1995)
4. The Structure of Liberty — Randy Barnett (1998)
5. The Liberalism of Fear — Judith Shklar (1989)
6. The Communist Manifesto — Marx & Engels (1848)
7. Communitarianism and Its Critics — Daniel Bell (1993)
8. Liberalism and Social Action — John Dewey (1935)
9. Political Liberalism — John Rawls (1993)
10. The Third Way — Anthony Giddens (1998)

**political-philosophy/social-contract-and-legitimacy**
1. Leviathan — Thomas Hobbes (1651)
2. The Social Contract — Jean-Jacques Rousseau (1762)
3. Second Treatise of Government — John Locke (1689)
4. The Republic — Plato (c. 375 BCE)
5. Legitimacy and the Modern State — Rodney Barker (1980)
6. The Problem of Political Authority — Michael Huemer (2013)
7. A Theory of Justice — John Rawls (1971)
8. The Authority of the State — Leslie Green (1988)
9. Political Obligation — John Horton (1992)
10. Consent, Contract, and Political Authority — Mark Murphy (1995)

#### 10-religion-spirituality (2 empty)

**abrahamic-religions/judaism/a-history-of-god-karen-armstrong**
1. A History of God — Karen Armstrong (1993)
2. The Bible: A Biography — Karen Armstrong (2007)
3. Jerusalem: One City, Three Faiths — Karen Armstrong (1996)
4. The Great Transformation — Karen Armstrong (2006)
5. Judaism: A Very Short Introduction — Norman Solomon (1996)
6. Jewish Literacy — Joseph Telushkin (1991)
7. To Be a Jew — Hayim Donin (1972)
8. The Jewish Way — Irving Greenberg (1988)
9. Messianic Idea in Judaism — Gershom Scholem (1971)
10. The Encyclopedia of Jewish Myth, Magic and Mysticism — Dennis (2007)

**abrahamic-religions/judaism**

**(has 1 book, need 9 more — see above)**
*(Note: this leaf has A History of God; above list provides 9 additional)*

#### 08-psychology (1 empty)

**developmental-psychology/the-whole-brain-child-daniel-siegel**
1. The Whole-Brain Child — Daniel Siegel (2011)
2. Parenting from the Inside Out — Siegel & Hartzell (2003)
3. No-Drama Discipline — Siegel & Bryson (2014)
4. Brainstorm — Daniel Siegel (2013)
5. Mind: A Journey to the Heart of Being Human — Siegel (2016)
6. The Developing Mind — Daniel Siegel (1999)
7. Mindsight — Daniel Siegel (2010)
8. How Children Succeed — Paul Tough (2012)
9. NurtureShock — Bronson & Merryman (2009)
10. The Gardener and the Carpenter — Alison Gopnik (2016)

#### 05-productivity-performance (2 empty)

**habit-formation-and-behavioral-systems/the-power-of-habit-charles-duhigg**
1. The Power of Habit — Charles Duhigg (2012)
2. Atomic Habits — James Clear (2018)
3. Better Than Before — Gretchen Rubin (2015)
4. Tiny Habits — BJ Fogg (2019)
5. The Habit Loop — Charles Duhigg (2012, chapter)
6. Switch — Chip & Dan Heath (2010)
7. Smarter Faster Better — Charles Duhigg (2016)
8. Triggers — Marshall Goldsmith (2015)
9. The Happiness Advantage — Shawn Achor (2010)
10. Willpower — Baumeister & Tierney (2011)

**learning-and-skill-acquisition/peak-anders-ericsson**
1. Peak — Anders Ericsson (2016)
2. Outliers — Malcolm Gladwell (2008)
3. Talent Is Overrated — Geoff Colvin (2008)
4. The Talent Code — Daniel Coyle (2009)
5. The Little Book of Talent — Daniel Coyle (2012)
6. The First 20 Hours — Josh Kaufman (2013)
7. Ultralearning — Scott Young (2019)
8. Moonwalking with Einstein — Joshua Foer (2011)
9. The Art of Learning — Josh Waitzkin (2007)
10. Mastery — Robert Greene (2012)

#### 07-decision-making-systems-thinking (1 empty)

**thinking-in-bets-annie-duke**
1. Thinking in Bets — Annie Duke (2018)
2. How to Decide — Annie Duke (2020)
3. The Power of Knowing What You Know — Annie Duke (2022)
4. The Art of Decision Making — Joseph Bikart (2017)
5. Decision Quality — Carl Spetzler (2016)
6. Smart Choices — Hammond, Keeney, Raiffa (1999)
7. Decisive — Chip & Dan Heath (2013)
8. The Decisive Mind — Sheena Iyengar (2014)
9. The Paradox of Choice — Barry Schwartz (2004)
10. Predictably Irrational — Dan Ariely (2008)

#### 32-literary-criticism-theory (1 empty)

**modern-literary-theory/literary-theory-terry-eagleton**
1. Literary Theory: An Introduction — Terry Eagleton (1983)
2. Marxism and Literary Criticism — Terry Eagleton (1976)
3. The Function of Criticism — Terry Eagleton (1984)
4. After Theory — Terry Eagleton (2003)
5. How to Read Literature — Terry Eagleton (2013)
6. The Meaning of Life: A Very Short Introduction — Eagleton (2007)
7. The Norton Anthology of Theory and Criticism (2001)
8. Beginning Theory — Peter Barry (1995)
9. Theory of Literature — René Wellek & Austin Warren (1949)
10. Literary Criticism: An Introduction — David Daiches (1981)

#### 31-architecture-art-design (1 empty)

**design/the-design-of-everyday-things-don-norman**
1. The Design of Everyday Things — Don Norman (1988)
2. Emotional Design — Don Norman (2004)
3. The Design of Future Things — Don Norman (2007)
4. Living with Complexity — Don Norman (2010)
5. Don't Make Me Think — Steve Krug (2000)
6. The Inmates Are Running the Asylum — Alan Cooper (1999)
7. About Face — Alan Cooper (1995)
8. Universal Principles of Design — Lidwell, Holden, Butler (2003)
9. 100 Things Every Designer Needs — Susan Weinschenk (2011)
10. Thinking with Type — Ellen Lupton (2004)

#### 30-music-film-media (1 empty)

**music/this-is-your-brain-on-music-daniel-levitin**
1. This Is Your Brain on Music — Daniel Levitin (2006)
2. The World in Six Songs — Daniel Levitin (2008)
3. Musicophilia — Oliver Sacks (2007)
4. Music and the Mind — Anthony Storr (1992)
5. How Music Works — David Byrne (2012)
6. The Music Instinct — Philip Ball (2010)
7. The Song Machine — John Seabrook (2015)
8. The Rest Is Noise — Alex Ross (2007)
9. Beethoven: The Universal Composer — Edmund Morris (2005)
10. The History of Western Music — Grout & Palisca (1960)

#### 21-nature-environment-ecology (1 empty)

**natural-history-writing/silent-spring-rachel-carson**
1. Silent Spring — Rachel Carson (1962)
2. The Sea Around Us — Rachel Carson (1951)
3. The Edge of the Sea — Rachel Carson (1955)
4. The Sense of Wonder — Rachel Carson (1956)
5. Under the Sea Wind — Rachel Carson (1941)
6. Lost Woods: The Collected Writing — Rachel Carson (1998)
7. Braiding Sweetgrass — Robin Wall Kimmerer (2013)
8. A Sand County Almanac — Aldo Leopold (1949)
9. The Death of Nature — Carolyn Merchant (1980)
10. Pilgrim at Tinker Creek — Annie Dillard (1974)

---

## All Leaves With 1 Book — Need 9 More Each

*Every leaf below currently has 1 book. Generate 9 additional books per leaf. Organized by batch for systematic coverage.*

### BATCH 1: 02 Computer Science (49 leaves × 9 = 441 books)

#### algorithms-and-data-structures/advanced-data-structures
1. Already has 1. Add:
2. Handbook of Data Structures — Mehta & Sahni (2004)
3. Advanced Data Structures — Peter Brass (2008)
4. The Art of Computer Programming, Vol 3 — Knuth (1973)
5. Data Structures and Algorithm Analysis — Mark A. Weiss (1992)
6. Purely Functional Data Structures — Chris Okasaki (1996)
7. Algorithm Design — Kleinberg & Tardos (2005)
8. Algorithms — Robert Sedgewick (1983)
9. Algorithms and Data Structures — Aho, Hopcroft, Ullman (1983)
10. Introduction to Algorithms, 4/e — Cormen et al. (2022)

*(Continue same pattern for every leaf with 1 book...)*

> **NOTE:** The full per-leaf expansion for all 708 leaves with 1 book is available in the companion script `build-plan.ps1`. The pattern above shows the format. Each session will work through one subcategory at a time following this exact structure.

---

## Batch Progress Tracker

| Batch | Category | Scope | Books | Dir Count | Status |
|---|---|---|---|---|---|
| 0 | — | Empty leaves fill (540 books) | 5400 | 540 | ⬜ |
| 1 | 01 Health | 3 leaves × 9 more | 27 | 3 | ⬜ |
| 2 | 02 Medicine | 5 leaves × 9 more | 45 | 5 | ⬜ |
| 3 | 03 Biology | 0 | 0 | 0 | ⬜ |
| 4 | 04 Self-Help | 0 | 0 | 0 | ⬜ |
| 5 | 05 Productivity | 0 | 0 | 0 | ⬜ |
| 6 | 06 Effectiveness | 0 | 0 | 0 | ⬜ |
| 7 | 07 Decision | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 8 | 08 Psychology | 2 leaves × 9 more | 18 | 2 | ⬜ |
| 9 | 09 Philosophy | 2 leaves × 9 more | 18 | 2 | ⬜ |
| 10 | 10 Religion | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 11 | 11 Finance | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 12 | 12 Business | 0 | 0 | 0 | ⬜ |
| 13 | 13 Economics | 0 | 0 | 0 | ⬜ |
| 14 | 14 Comm/Ling | 0 | 0 | 0 | ⬜ |
| 15 | 15 Education | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 16 | 16 Social Sci | 6 leaves × 9 more | 54 | 6 | ⬜ |
| 17 | 17 Law | 5 leaves × 9 more | 45 | 5 | ⬜ |
| 18 | 18 History | 4 leaves × 9 more | 36 | 4 | ⬜ |
| 19 | 19 PoliSci | 0 | 0 | 0 | ⬜ |
| 20 | 20 Pure Sciences | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 21 | 21 Nature/Eco | 2 leaves × 9 more | 18 | 2 | ⬜ |
| 22 | 22 Mathematics | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 23 | 23 CS | 0 | 0 | 0 | ⬜ |
| 24 | 24 Software Eng | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 25 | 25 AI/ML | 0 | 0 | 0 | ⬜ |
| 26 | 26 Tech/Eng | 0 | 0 | 0 | ⬜ |
| 27 | 27 Biography | 6 leaves × 9 more | 54 | 6 | ⬜ |
| 28 | 28 Fiction | 1 leaf × 9 more | 9 | 1 | ⬜ |
| 29 | 29 Poetry/Drama | 0 | 0 | 0 | ⬜ |
| 30 | 30 Music/Film | 0 | 0 | 0 | ⬜ |
| 31 | 31 Art/Design | 0 | 0 | 0 | ⬜ |
| 32 | 32 Lit Crit | 0 | 0 | 0 | ⬜ |
| | **TOTAL** | | **387** | **43** | |

## File Structure Convention

```
knowledge/
  NN-category-name/
    subcategory-name/
      sub-subcategory-name/
        book-slug-author-name/
          index.mdx        # Book overview + metadata
          01-content.mdx   # Comprehensive summary with Reading Guide
          02-analysis.mdx  # Critical analysis with all required sections
          03-narration.mdx # Narrative & writing style
          meta.json        # Structured metadata
```

---

## Execution Priority

**Phase 0 — EMERGENCY:** Fill 54 completely empty leaves (10 books each = 540 books)
**Phase 1 — ZERO-DEFICIT:** Categories with full initial books (02, 03, 04, 06, 07, 09, 11, 17, 18, 19, 20, 22, 24, 25, 26) — 337 leaves × 9 = 3,033 books
**Phase 2 — PARTIAL-DEFICIT:** Categories with some empty leaves (01, 05, 08, 12, 13, 14, 15, 16, 21, 23, 27, 28, 29, 30) — 371 leaves × 9 = 3,339 books
**Phase 3 — MAINTENANCE:** Ongoing addition to all categories until 10+ per leaf
