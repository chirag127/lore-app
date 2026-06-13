#!/usr/bin/env python3
"""
Generate all leaf category index.mdx files for BookAtlas.
"""

import os
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

ALL_LEAF_CATEGORIES = {
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
    },
    "03-money-markets-and-wealth": {
        "advanced-investing-and-risk": {
            "title": "Advanced Investing & Risk",
            "description": "Sophisticated investment strategies and risk management",
            "topics": ["Derivatives", "Hedge funds", "Risk models", "Alternative investments", "Portfolio optimization"],
            "related": ["03 Money", "05 Business"]
        },
        "behavioral-finance": {
            "title": "Behavioral Finance",
            "description": "Psychological factors in investment decisions",
            "topics": ["Cognitive biases", "Investor psychology", "Market anomalies", "Behavioral economics", "Prospect theory"],
            "related": ["01 Mind", "03 Money", "07 Math"]
        },
        "economics": {
            "title": "Economics",
            "description": "Economic theory and policy",
            "topics": ["Microeconomics", "Macroeconomics", "Game theory", "Industrial organization", "Labor economics"],
            "related": ["03 Money", "08 Society"]
        },
        "financial-history": {
            "title": "Financial History",
            "description": "Historical perspectives on markets and finance",
            "topics": ["Market crashes", "Financial crises", "Banking history", "Monetary policy", "Economic bubbles"],
            "related": ["03 Money", "08 Society"]
        },
        "personal-finance-and-wealth-building": {
            "title": "Personal Finance & Wealth Building",
            "description": "Individual financial management and wealth accumulation",
            "topics": ["Budgeting", "Investing", "Retirement", "Tax planning", "Financial independence"],
            "related": ["03 Money", "05 Business"]
        },
        "real-estate": {
            "title": "Real Estate",
            "description": "Property investment and market analysis",
            "topics": ["Real estate investing", "Property development", "REITs", "Market analysis", "Wealth building"],
            "related": ["03 Money", "04 Computers"]
        },
        "value-and-index-investing": {
            "title": "Value & Index Investing",
            "description": "Evidence-based investment approaches",
            "topics": ["Value investing", "Index funds", "Efficient market hypothesis", "Factor investing", "Bogleheads"],
            "related": ["03 Money", "07 Math"]
        },
        "venture-capital-and-private-equity": {
            "title": "Venture Capital & Private Equity",
            "description": "Private market investing and startup finance",
            "topics": ["Venture capital", "Private equity", "Term sheets", "Due diligence", "Exits"],
            "related": ["03 Money", "05 Business"]
        }
    },
    "04-computers-ai-and-software": {
        "artificial-intelligence": {
            "title": "Artificial Intelligence",
            "description": "Machine intelligence, deep learning, and AI applications",
            "topics": ["Machine learning", "Deep learning", "NLP", "Computer vision", "AI safety"],
            "related": ["04 Computers", "07 Math", "01 Mind"]
        },
        "computer-science-theory": {
            "title": "Computer Science Theory",
            "description": "Foundational concepts in computing",
            "topics": ["Algorithms", "Complexity theory", "Formal languages", "Automata theory", "Information theory"],
            "related": ["04 Computers", "07 Math"]
        },
        "cybersecurity": {
            "title": "Cybersecurity",
            "description": "Protecting systems and information from threats",
            "topics": ["Network security", "Cryptography", "Penetration testing", "Threat modeling", "Incident response"],
            "related": ["04 Computers", "05 Business"]
        },
        "data-algorithms-and-databases": {
            "title": "Data, Algorithms & Databases",
            "description": "Managing and processing data at scale",
            "topics": ["Database systems", "Data pipelines", "Algorithms", "Big data", "Query optimization"],
            "related": ["04 Computers", "07 Math"]
        },
        "devops-and-platform-engineering": {
            "title": "DevOps & Platform Engineering",
            "description": "Building and operating reliable systems",
            "topics": ["CI/CD", "Infrastructure as code", "Containers", "Monitoring", "SRE"],
            "related": ["04 Computers", "05 Business"]
        },
        "engineering-and-technology": {
            "title": "Engineering & Technology",
            "description": "Broader engineering disciplines and innovation",
            "topics": ["Systems engineering", "Product design", "Manufacturing", "Quality assurance", "Project management"],
            "related": ["04 Computers", "05 Business"]
        },
        "networking-and-distributed-systems": {
            "title": "Networking & Distributed Systems",
            "description": "Network protocols and scalable architectures",
            "topics": ["TCP/IP", "HTTP", "Load balancing", "Consensus algorithms", "Distributed databases"],
            "related": ["04 Computers", "07 Math"]
        },
        "software-engineering": {
            "title": "Software Engineering",
            "description": "Principles and practices of building software",
            "topics": ["Design patterns", "Testing", "Architecture", "Code quality", "Agile methods"],
            "related": ["04 Computers", "05 Business"]
        },
        "system-design-and-architecture": {
            "title": "System Design & Architecture",
            "description": "Designing scalable and maintainable systems",
            "topics": ["Architecture patterns", "Scalability", "Microservices", "API design", "System trade-offs"],
            "related": ["04 Computers", "05 Business"]
        }
    },
    "07-math-logic-and-science": {
        "chemistry-and-biology": {
            "title": "Chemistry & Biology",
            "description": "Chemical and biological sciences",
            "topics": ["Organic chemistry", "Biochemistry", "Molecular biology", "Biophysics", "Pharmacology"],
            "related": ["02 Body", "07 Math"]
        },
        "earth-sciences-and-nature": {
            "title": "Earth Sciences & Nature",
            "description": "Geology, ecology, and environmental science",
            "topics": ["Geology", "Ecology", "Environmental science", "Meteorology", "Oceanography"],
            "related": ["02 Body", "08 Society"]
        },
        "history-and-philosophy-of-science": {
            "title": "History & Philosophy of Science",
            "description": "The development of scientific thought",
            "topics": ["History of science", "Philosophy of science", "Scientific method", "Paradigm shifts", "Science studies"],
            "related": ["07 Math", "08 Society"]
        },
        "mathematics": {
            "title": "Mathematics",
            "description": "Pure mathematics and mathematical thinking",
            "topics": ["Algebra", "Calculus", "Geometry", "Topology", "Mathematical proof"],
            "related": ["07 Math", "04 Computers"]
        },
        "physics-and-astronomy": {
            "title": "Physics & Astronomy",
            "description": "Physical laws and the cosmos",
            "topics": ["Classical mechanics", "Quantum mechanics", "Relativity", "Astrophysics", "Cosmology"],
            "related": ["07 Math", "08 Society"]
        },
        "popular-science": {
            "title": "Popular Science",
            "description": "Science for general audiences",
            "topics": ["Science writing", "Popular physics", "Science communication", "Science history"],
            "related": ["07 Math", "09 Communication"]
        },
        "statistics-and-probability": {
            "title": "Statistics & Probability",
            "description": "Data analysis and statistical reasoning",
            "topics": ["Statistical inference", "Probability theory", "Hypothesis testing", "Regression", "Bayesian methods"],
            "related": ["07 Math", "04 Computers", "01 Mind"]
        }
    },
    "08-society-history-and-power": {
        "cultural-studies": {
            "title": "Cultural Studies",
            "description": "Social and cultural analysis",
            "topics": ["Cultural theory", "Media studies", "Gender studies", "Postcolonial theory", "Subcultures"],
            "related": ["08 Society", "05 Business"]
        },
        "education-and-pedagogy": {
            "title": "Education & Pedagogy",
            "description": "The theory and practice of teaching and learning",
            "topics": ["Learning theory", "Curriculum design", "Educational psychology", "Assessment", "School reform"],
            "related": ["08 Society", "01 Mind", "15 Education"]
        },
        "historical-biography-and-memoir": {
            "title": "Historical Biography & Memoir",
            "description": "Lives and events that shaped history",
            "topics": ["Biography", "Memoir", "Historical narrative", "Primary sources", "Historical analysis"],
            "related": ["08 Society", "10 Fiction"]
        },
        "political-science-and-geopolitics": {
            "title": "Political Science & Geopolitics",
            "description": "Political systems, theory, and international relations",
            "topics": ["Political theory", "Comparative politics", "International relations", "Geopolitics", "Public policy"],
            "related": ["08 Society", "05 Business", "06 Philosophy"]
        },
        "public-policy-and-law": {
            "title": "Public Policy & Law",
            "description": "Policy formation and legal systems",
            "topics": ["Public policy", "Constitutional law", "Legal theory", "Regulation", "Justice"],
            "related": ["08 Society", "05 Business"]
        },
        "sociology-and-anthropology": {
            "title": "Sociology & Anthropology",
            "description": "Human societies and cultures",
            "topics": ["Social structures", "Anthropology", "Deviance", "Social inequality", "Cultural anthropology"],
            "related": ["08 Society", "01 Mind"]
        },
        "world-history-and-civilizations": {
            "title": "World History & Civilizations",
            "description": "Major historical periods and cultures",
            "topics": ["Ancient history", "Medieval history", "Modern history", "Civilizations", "Historical methodology"],
            "related": ["08 Society", "05 Business"]
        }
    },
    "09-communication-writing-and-creativity": {
        "communication-theory": {
            "title": "Communication Theory",
            "description": "Theoretical foundations of human communication",
            "topics": ["Communication models", "Media theory", "Intercultural communication", "Nonverbal communication", "Mass media"],
            "related": ["09 Communication", "01 Mind"]
        },
        "language-learning": {
            "title": "Language Learning",
            "description": "Approaches to acquiring languages",
            "topics": ["Language acquisition", "Polyglot methods", "Teaching techniques", "Immersion", "Vocabulary building"],
            "related": ["09 Communication", "08 Society"]
        },
        "linguistics": {
            "title": "Linguistics",
            "description": "The science of language",
            "topics": ["Syntax", "Semantics", "Phonology", "Historical linguistics", "Sociolinguistics"],
            "related": ["09 Communication", "07 Math"]
        },
        "persuasion-and-rhetoric": {
            "title": "Persuasion & Rhetoric",
            "description": "The art of influencing others",
            "topics": ["Rhetorical theory", "Negotiation", "Influence", "Argumentation", "Ethos/pathos/logos"],
            "related": ["09 Communication", "05 Business"]
        },
        "public-speaking-and-presentation": {
            "title": "Public Speaking & Presentation",
            "description": "Communicating effectively to audiences",
            "topics": ["Presentation skills", "Speaking technique", "Audience analysis", "Storytelling", "Stage presence"],
            "related": ["09 Communication", "05 Business"]
        },
        "storytelling": {
            "title": "Storytelling",
            "description": "The craft of narrative",
            "topics": ["Narrative structure", "Character development", "Plot theory", "Storytelling techniques", "Folk tales"],
            "related": ["09 Communication", "10 Fiction"]
        },
        "writing-craft-and-nonfiction": {
            "title": "Writing Craft & Nonfiction",
            "description": "The art of writing nonfiction",
            "topics": ["Writing technique", "Style", "Research writing", "Journalism", "Memoir"],
            "related": ["09 Communication", "10 Fiction"]
        }
    },
    "10-fiction-and-literature": {
        "art-and-design": {
            "title": "Art & Design",
            "description": "Visual arts and design principles",
            "topics": ["Visual design", "Art history", "Graphic design", "Architecture", "Design thinking"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "film-and-media-studies": {
            "title": "Film & Media Studies",
            "description": "Cinema and media analysis",
            "topics": ["Film theory", "Cinematography", "Screenwriting", "Media studies", "Documentary"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "genre-fiction": {
            "title": "Genre Fiction",
            "description": "Popular fiction genres",
            "topics": ["Mystery", "Science fiction", "Fantasy", "Thriller", "Horror"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "literary-biography-and-memoir": {
            "title": "Literary Biography & Memoir",
            "description": "Life writing and personal narratives",
            "topics": ["Biography", "Autobiography", "Memoir", "Personal essays", "Diaries"],
            "related": ["10 Fiction", "08 Society"]
        },
        "literary-criticism": {
            "title": "Literary Criticism",
            "description": "Analyzing and interpreting literature",
            "topics": ["Critical theory", "Literary analysis", "Genre studies", "Author studies", "Textual criticism"],
            "related": ["10 Fiction", "06 Philosophy"]
        },
        "literary-fiction": {
            "title": "Literary Fiction",
            "description": "Novels of literary merit",
            "topics": ["Character-driven fiction", "Thematic depth", "Narrative technique", "Literary awards", "Contemporary fiction"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "music": {
            "title": "Music",
            "description": "Musical theory, history, and appreciation",
            "topics": ["Music theory", "Composers", "Genres", "Performance", "Music history"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "poetry-and-drama": {
            "title": "Poetry & Drama",
            "description": "Poetic and dramatic literature",
            "topics": ["Poetry forms", "Drama", "Verse", "Theater", "Performance poetry"],
            "related": ["10 Fiction", "09 Communication"]
        },
        "speculative-fiction": {
            "title": "Speculative Fiction",
            "description": "Fantasy, science fiction, and alternative worlds",
            "topics": ["Fantasy", "Science fiction", "Horror", "Alternate history", "Dystopian fiction"],
            "related": ["10 Fiction", "04 Computers"]
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
    """Generate all leaf category index files."""
    for top_cat, leaves in ALL_LEAF_CATEGORIES.items():
        top_dir = KNOWLEDGE_DIR / top_cat
        for leaf_name, config in leaves.items():
            leaf_dir = top_dir / leaf_name
            leaf_dir.mkdir(parents=True, exist_ok=True)
            create_index_file(leaf_dir, config)

if __name__ == "__main__":
    main()