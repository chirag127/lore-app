# BookAtlas Category Guide

## Category Hierarchy

```
Top Category (10 total)
  └── Leaf Category (82 total)
        └── Book (5 files + meta.json)
```

## Top Categories

1. **01-mind-behavior-and-human-performance** - Psychology, learning, decision-making
2. **02-body-health-and-life-sciences** - Medicine, biology, health
3. **03-money-markets-and-wealth** - Finance, investing, economics
4. **04-computers-ai-and-software** - Programming, AI, systems
5. **05-business-strategy-and-organizations** - Business, leadership, entrepreneurship
6. **06-philosophy-religion-and-indian-thought** - Philosophy, wisdom traditions
7. **07-math-logic-and-science** - Mathematics, scientific method
8. **08-society-history-and-power** - Social sciences, history, politics
9. **09-communication-writing-and-creativity** - Rhetoric, writing, storytelling
10. **10-fiction-and-literature** - Literary fiction, poetry, drama

## Leaf Categories

Each top category contains 4-10 leaf categories. Examples:

### 01-mind-behavior-and-human-performance
- cognitive-and-behavioral-psychology
- cognitive-biases-and-rationality
- creativity-and-innovation
- habits-productivity-and-focus
- learning-and-skill-acquisition
- mental-models-and-decision-making
- probability-forecasting-and-risk
- social-positive-and-clinical-psychology
- systems-thinking-and-game-theory

### 02-body-health-and-life-sciences
- biology-and-life-sciences
- exercise-and-fitness
- longevity-and-aging
- medicine-and-clinical-science
- neuroscience-and-brain-health
- nutrition-and-diet
- psychiatry-and-mental-health
- sleep-science

## Category Boundaries

Categories are mutually exclusive:
- 01 vs 02: Psychology vs clinical medicine
- 01 vs 06: Cognitive science vs philosophy of mind
- 03 vs 05: Market investing vs corporate finance
- 04 vs 07: Applied math vs pure mathematics
- 06 vs 10: Philosophy vs religious practice

## Creating a New Category

1. Only create if 5+ books needed
2. Must fit within existing top category
3. Create index.mdx with overview
4. Define clear scope and boundaries
5. List essential books

## Book Placement

Books go directly in leaf categories:
```
knowledge/
  01-mind-behavior-and-human-performance/
    learning-and-skill-acquisition/
      atomic-habits-james-clear/
        index.mdx
        01-content.mdx
        02-analysis.mdx
        03-narration.mdx
        meta.json
```

## Cross-Links

Each category index.mdx should link to:
- 2-3 related categories
- Essential books in related fields