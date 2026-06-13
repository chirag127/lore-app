#!/usr/bin/env python3
"""
Generate leaf category index.mdx files.
"""

import os
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

LEAF_CATEGORIES = {
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
    "02-body-health-and-life-sciences": {
        "biology-and-life-sciences": {
            "title": "Biology & Life Sciences",
            "description": "The science of living organisms and life processes",
            "topics": ["Cell biology", "Genetics", "Evolution", "Physiology", "Anatomy"],
            "related": ["02 Body", "07 Math"]
        },
        "exercise-and-fitness": {
            "title": "Exercise & Fitness",
            "description": "Physical training and health optimization",
            "topics": ["Strength training", "Cardiovascular fitness", "Flexibility", "Nutrition", "Recovery"],
            "related": ["02 Body", "09 Communication"]
        },
        "longevity-and-aging": {
            "title": "Longevity & Aging",
            "description": "The biology of aging and extending healthy life",
            "topics": ["Aging biology", "Geroscience", "Telomeres", "Senescence", "Healthspan"],
            "related": ["02 Body", "03 Money"]
        },
        "medicine-and-clinical-science": {
            "title": "Medicine & Clinical Science",
            "description": "Medical practice, diagnosis, and treatment",
            "topics": ["Pathophysiology", "Clinical reasoning", "Evidence-based medicine", "Diagnostics", "Therapeutics"],
            "related": ["02 Body", "05 Business"]
        },
        "neuroscience-and-brain-health": {
            "title": "Neuroscience & Brain Health",
            "description": "The science of the brain and nervous system",
            "topics": ["Neural circuits", "Neuroplasticity", "Cognitive neuroscience", "Brain optimization", "Neurochemistry"],
            "related": ["01 Mind", "02 Body", "07 Math"]
        },
        "nutrition-and-diet": {
            "title": "Nutrition & Diet",
            "description": "Food science and dietary optimization for health",
            "topics": ["Macronutrients", "Micronutrients", "Metabolism", "Gut health", "Dietary patterns"],
            "related": ["02 Body", "03 Money"]
        },
        "psychiatry-and-mental-health": {
            "title": "Psychiatry & Mental Health",
            "description": "Clinical approaches to mental health disorders",
            "topics": ["Mental health", "Psychopathology", "Psychopharmacology", "Therapy", "Diagnosis"],
            "related": ["01 Mind", "02 Body"]
        },
        "sleep-science": {
            "title": "Sleep Science",
            "description": "The biology and optimization of sleep",
            "topics": ["Sleep cycles", "Circadian rhythms", "Sleep disorders", "Sleep hygiene", "Recovery"],
            "related": ["02 Body", "01 Mind"]
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
    
    index_path.write_text(content)
    print(f"Created: {index_path}")

def main():
    """Generate all leaf category index files."""
    for top_cat, leaves in LEAF_CATEGORIES.items():
        top_dir = KNOWLEDGE_DIR / top_cat
        for leaf_name, config in leaves.items():
            leaf_dir = top_dir / leaf_name
            leaf_dir.mkdir(parents=True, exist_ok=True)
            create_index_file(leaf_dir, config)

if __name__ == "__main__":
    main()