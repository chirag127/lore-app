#!/usr/bin/env python3
"""
Generate remaining leaf category index.mdx files.
"""

from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

REMAINING_LEAF_CATEGORIES = {
    "01-mind-behavior-and-human-performance": {
        "cognitive-and-behavioral-psychology": {
            "title": "Cognitive & Behavioral Psychology",
            "description": "Understanding human cognition, behavior, and psychological processes",
            "topics": ["Cognitive psychology", "Behavioral psychology", "Social psychology", "Developmental psychology", "Personality psychology"],
            "related": ["02 Body", "06 Philosophy"]
        },
        "cognitive-biases-and-rationality": {
            "title": "Cognitive Biases & Rationality",
            "description": "Systematic errors in human judgment and how to think more clearly",
            "topics": ["Cognitive biases", "Heuristics", "Rationality", "Decision making", "Debiasing"],
            "related": ["01 Mind", "03 Money", "07 Math"]
        },
        "creativity-and-innovation": {
            "title": "Creativity & Innovation",
            "description": "How ideas emerge, develop, and create breakthrough insights",
            "topics": ["Creative thinking", "Design thinking", "Innovation processes", "Lateral thinking", "Idea generation"],
            "related": ["01 Mind", "09 Communication", "05 Business"]
        },
        "habits-productivity-and-focus": {
            "title": "Habits, Productivity & Focus",
            "description": "Building systems for peak performance and sustained output",
            "topics": ["Habit formation", "Productivity systems", "Focus", "Attention management", "Energy management"],
            "related": ["01 Mind", "05 Business", "07 Math"]
        },
        "learning-and-skill-acquisition": {
            "title": "Learning & Skill Acquisition",
            "description": "How people learn, improve, and master skills",
            "topics": ["Deliberate practice", "Spaced repetition", "Expertise development", "Meta-learning", "Study techniques"],
            "related": ["01 Mind", "07 Math", "04 Computers"]
        },
        "mental-models-and-decision-making": {
            "title": "Mental Models & Decision Making",
            "description": "Frameworks for better thinking and decision-making",
            "topics": ["Mental models", "First principles", "Decision frameworks", "Systems thinking", "Cognitive tools"],
            "related": ["01 Mind", "03 Money", "05 Business"]
        },
        "probability-forecasting-and-risk": {
            "title": "Probability, Forecasting & Risk",
            "description": "Reasoning under uncertainty and making predictions",
            "topics": ["Probability theory", "Forecasting", "Risk assessment", "Bayesian thinking", "Prediction markets"],
            "related": ["01 Mind", "03 Money", "07 Math"]
        },
        "social-positive-and-clinical-psychology": {
            "title": "Social & Positive Psychology",
            "description": "Group behavior, social dynamics, and human flourishing",
            "topics": ["Social psychology", "Group dynamics", "Positive psychology", "Well-being", "Motivation"],
            "related": ["01 Mind", "02 Body", "05 Business"]
        },
        "systems-thinking-and-game-theory": {
            "title": "Systems Thinking & Game Theory",
            "description": "Understanding complex systems and strategic interaction",
            "topics": ["Systems thinking", "Feedback loops", "Game theory", "Strategic thinking", "Causal models"],
            "related": ["01 Mind", "05 Business", "07 Math"]
        }
    },
    "05-business-strategy-and-organizations": {
        "business-strategy": {
            "title": "Business Strategy",
            "description": "Competitive positioning and strategic planning",
            "topics": ["Strategy formulation", "Competitive advantage", "Blue ocean strategy", "Porter's five forces", "SWOT analysis"],
            "related": ["05 Business", "03 Money"]
        },
        "consulting-and-frameworks": {
            "title": "Consulting & Frameworks",
            "description": "Management consulting approaches and analytical frameworks",
            "topics": ["Management consulting", "Strategic frameworks", "Problem-solving", "Case interviews", "Client management"],
            "related": ["05 Business", "07 Math"]
        },
        "corporate-finance-and-accounting": {
            "title": "Corporate Finance & Accounting",
            "description": "Financial management and reporting for corporations",
            "topics": ["Financial statements", "Valuation", "Capital budgeting", "Cost accounting", "Financial analysis"],
            "related": ["05 Business", "03 Money"]
        },
        "entrepreneurship-and-startups": {
            "title": "Entrepreneurship & Startups",
            "description": "Starting and building new businesses",
            "topics": ["Startup formation", "Venture capital", "Business models", "Founder psychology", "Scaling"],
            "related": ["05 Business", "03 Money"]
        },
        "leadership": {
            "title": "Leadership",
            "description": "Leading individuals and teams",
            "topics": ["Leadership styles", "Emotional intelligence", "Team management", "Vision setting", "Change management"],
            "related": ["05 Business", "01 Mind"]
        },
        "management-and-organizational-behavior": {
            "title": "Management & Organizational Behavior",
            "description": "How organizations function and how to improve them",
            "topics": ["Organizational design", "Culture", "Motivation", "Performance management", "Employee engagement"],
            "related": ["05 Business", "01 Mind"]
        },
        "marketing-and-brand-strategy": {
            "title": "Marketing & Brand Strategy",
            "description": "Building brands and market presence",
            "topics": ["Brand positioning", "Consumer behavior", "Digital marketing", "Campaign strategy", "Customer acquisition"],
            "related": ["05 Business", "09 Communication"]
        },
        "operations-and-supply-chain": {
            "title": "Operations & Supply Chain",
            "description": "Managing processes and logistics",
            "topics": ["Operations management", "Supply chain", "Lean manufacturing", "Quality control", "Process optimization"],
            "related": ["05 Business", "04 Computers"]
        },
        "product-management": {
            "title": "Product Management",
            "description": "Building successful products",
            "topics": ["Product strategy", "User research", "Roadmapping", "Metrics", "Cross-functional leadership"],
            "related": ["05 Business", "04 Computers"]
        },
        "sales-and-business-development": {
            "title": "Sales & Business Development",
            "description": "Growing revenue and partnerships",
            "topics": ["Sales techniques", "Negotiation", "Partnerships", "Customer success", "Revenue growth"],
            "related": ["05 Business", "09 Communication"]
        }
    },
    "06-philosophy-religion-and-indian-thought": {
        "comparative-philosophy": {
            "title": "Comparative Philosophy",
            "description": "Comparing philosophical traditions across cultures",
            "topics": ["East-West philosophy", "Cross-cultural comparison", "Universal concepts", "Philosophical anthropology"],
            "related": ["06 Philosophy", "08 Society"]
        },
        "eastern-philosophy": {
            "title": "Eastern Philosophy",
            "description": "Asian philosophical traditions",
            "topics": ["Taoism", "Confucianism", "Buddhism", "Zen", "Japanese philosophy"],
            "related": ["06 Philosophy", "10 Fiction"]
        },
        "ethics-and-moral-philosophy": {
            "title": "Ethics & Moral Philosophy",
            "description": "Questions of right and wrong conduct",
            "topics": ["Moral theories", "Applied ethics", "Metaethics", "Virtue ethics", "Utilitarianism"],
            "related": ["06 Philosophy", "05 Business"]
        },
        "indian-philosophy": {
            "title": "Indian Philosophy",
            "description": "Ancient Indian philosophical traditions",
            "topics": ["Advaita Vedanta", "Buddhism", "Jainism", "Nyaya", "Mimamsa", "Vedanta"],
            "related": ["06 Philosophy", "10 Fiction"]
        },
        "religion-and-spirituality": {
            "title": "Religion & Spirituality",
            "description": "Religious traditions and spiritual practices",
            "topics": ["World religions", "Spiritual practices", "Mysticism", "Religious experience", "Faith"],
            "related": ["06 Philosophy", "10 Fiction"]
        },
        "western-philosophy": {
            "title": "Western Philosophy",
            "description": "European and American philosophical traditions",
            "topics": ["Ancient Greece", "Medieval philosophy", "Modern philosophy", "Contemporary philosophy"],
            "related": ["06 Philosophy", "08 Society"]
        }
    }
}

INDEX_TEMPLATE = '''---
title: "{title}"
description: "{description}"
---

# Book Category: {title}

## Overview

{description}.

## Scope

| Includes | Excludes |
|----------|----------|
| {includes} | {excludes} |

## Topics Covered

{topics}

## Essential Books

| Level | Books |
|-------|-------|
| **Beginner** | [Beginner Book](slug-beginner-book-author) |
| **Intermediate** | [Intermediate Book](slug-intermediate-book-author) |
| **Advanced** | [Advanced Book](slug-advanced-book-author) |
| **Mastery** | [Mastery Book](slug-mastery-book-author) |

## Related Categories

| Category | Connection |
|----------|------------|
{related_links}

## Why This Category Matters

Brief explanation of why this category matters.
'''

def create_index_file(leaf_dir: Path, config: dict):
    """Create an index.mdx file for a leaf category."""
    index_path = leaf_dir / "index.mdx"
    
    if index_path.exists():
        return
    
    topics = "\n".join([f"- {t}" for t in config["topics"]])
    related_links = "\n".join([f"| {r} |" for r in config["related"]])
    
    content = INDEX_TEMPLATE.format(
        title=config["title"],
        description=config["description"],
        includes=config["topics"][0] if config["topics"] else "N/A",
        excludes="N/A",
        topics=topics,
        related_links=related_links
    )
    
    index_path.write_text(content, encoding='utf-8')
    print(f"Created: {index_path}")

def main():
    """Generate remaining leaf category index files."""
    for top_cat, leaves in REMAINING_LEAF_CATEGORIES.items():
        top_dir = KNOWLEDGE_DIR / top_cat
        for leaf_name, config in leaves.items():
            leaf_dir = top_dir / leaf_name
            leaf_dir.mkdir(parents=True, exist_ok=True)
            create_index_file(leaf_dir, config)

if __name__ == "__main__":
    main()