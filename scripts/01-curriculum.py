"""
KnowledgeAtlas 11-Category Curriculum
======================================
Canonical taxonomy: 11 categories, numbered subcategories,
numbered books. Every directory and file is numbered.

Usage:
    python scripts/01-curriculum.py          # prints JSON
    python scripts/01-curriculum.py --tree   # prints tree
"""
from __future__ import annotations
import json, sys
from dataclasses import dataclass, field, asdict
from typing import List

REQUIRED_FILES = [
    "01-index.mdx", "02-content.mdx", "03-analysis.mdx",
    "04-narration.mdx", "05-meta.json",
]
CATEGORY_FILES = [
    "01-index.mdx", "02-reading-order.mdx", "03-book-list.mdx", "04-meta.json",
]

def _s(text: str) -> str:
    return text.lower().replace(" ", "-").replace(",", "").replace(":", "").replace("'", "").replace(".", "").replace('"', "").replace("&", "and").replace("/", "-").replace("(", "").replace(")", "")

def _book(n: int, title: str, author: str, year: int, counterpoint=False, slug_override=None) -> dict:
    slug = slug_override or _s(f"{title}-{author}")
    return {
        "number": n, "title": title, "author": author, "year": year,
        "slug": slug, "counterpoint": counterpoint,
    }

def build_curriculum():
    cats = []

    # ═════════════════════════════════════════════════════════════════
    # 01: LEARNING & PRODUCTIVITY
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 1, "name": "Learning & Productivity",
        "slug": "01-learning-productivity",
        "description": "Meta-learning, study methods, deep work, skill acquisition, habits, creativity.",
        "subcategories": [
            {
                "number": 1, "name": "Learning Foundations",
                "slug": "01-learning-foundations",
                "books": [
                    _book(1, "How to Read a Book", "Mortimer J. Adler", 1940),
                    _book(2, "Learning How to Learn", "Barbara Oakley", 2018),
                    _book(3, "A Mind for Numbers", "Barbara Oakley", 2014),
                    _book(4, "Make It Stick", "Peter C. Brown", 2014),
                    _book(5, "Ultralearning", "Scott Young", 2019),
                    _book(6, "Peak", "Anders Ericsson", 2016),
                    _book(7, "The Art of Learning", "Josh Waitzkin", 2007),
                    _book(8, "Range", "David Epstein", 2019, counterpoint=True),
                    _book(9, "How to Take Smart Notes", "Sonke Ahrens", 2017),
                    _book(10, "The First 20 Hours", "Josh Kaufman", 2013),
                ]
            },
            {
                "number": 2, "name": "Habit Formation",
                "slug": "02-habit-formation",
                "books": [
                    _book(11, "Atomic Habits", "James Clear", 2018),
                    _book(12, "The Power of Habit", "Charles Duhigg", 2012),
                    _book(13, "Tiny Habits", "BJ Fogg", 2019),
                    _book(14, "Better Than Before", "Gretchen Rubin", 2015),
                    _book(15, "Switch", "Chip & Dan Heath", 2010),
                    _book(16, "Willpower", "Roy Baumeister", 2011),
                    _book(17, "Triggers", "Marshall Goldsmith", 2015),
                ]
            },
            {
                "number": 3, "name": "Deep Work & Focus",
                "slug": "03-deep-work-focus",
                "books": [
                    _book(18, "Deep Work", "Cal Newport", 2016),
                    _book(19, "Digital Minimalism", "Cal Newport", 2019),
                    _book(20, "Indistractable", "Nir Eyal", 2019),
                    _book(21, "Four Thousand Weeks", "Oliver Burkeman", 2021, counterpoint=True),
                    _book(22, "The ONE Thing", "Gary Keller", 2013),
                    _book(23, "Essentialism", "Greg McKeown", 2014),
                    _book(24, "Eat That Frog", "Brian Tracy", 2001),
                ]
            },
            {
                "number": 4, "name": "Note-Taking & Knowledge Management",
                "slug": "04-note-taking-knowledge-management",
                "books": [
                    _book(25, "How to Take Smart Notes", "Sonke Ahrens", 2017),
                    _book(26, "Building a Second Brain", "Tiago Forte", 2022),
                    _book(27, "The PARA Method", "Tiago Forte", 2023),
                    _book(28, "Getting Things Done", "David Allen", 2001),
                ]
            },
            {
                "number": 5, "name": "Creativity & Innovation",
                "slug": "05-creativity-innovation",
                "books": [
                    _book(29, "Steal Like an Artist", "Austin Kleon", 2012),
                    _book(30, "Show Your Work", "Austin Kleon", 2014),
                    _book(31, "Creative Confidence", "Tom Kelley", 2013),
                    _book(32, "The War of Art", "Steven Pressfield", 2002),
                    _book(33, "Originals", "Adam Grant", 2016),
                ]
            },
            {
                "number": 6, "name": "Personal Productivity Systems",
                "slug": "06-personal-productivity-systems",
                "books": [
                    _book(34, "Getting Things Done", "David Allen", 2001),
                    _book(35, "The Effective Executive", "Peter Drucker", 1967),
                    _book(36, "The Checklist Manifesto", "Atul Gawande", 2009),
                    _book(37, "Smarter Faster Better", "Charles Duhigg", 2016),
                    _book(38, "The Happiness Advantage", "Shawn Achor", 2010),
                ]
            },
            {
                "number": 7, "name": "Skill Acquisition & Mastery",
                "slug": "07-skill-acquisition-mastery",
                "books": [
                    _book(39, "Ultralearning", "Scott Young", 2019),
                    _book(40, "Peak", "Anders Ericsson", 2016),
                    _book(41, "The Talent Code", "Daniel Coyle", 2009),
                    _book(42, "Talent Is Overrated", "Geoff Colvin", 2008),
                    _book(43, "Moonwalking with Einstein", "Joshua Foer", 2011),
                    _book(44, "Mastery", "Robert Greene", 2012),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 02: PSYCHOLOGY & HUMAN BEHAVIOR
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 2, "name": "Psychology & Human Behavior",
        "slug": "02-psychology-human-behavior",
        "description": "Cognitive, social, clinical, developmental, and positive psychology.",
        "subcategories": [
            {
                "number": 1, "name": "Cognitive Psychology",
                "slug": "01-cognitive-psychology",
                "books": [
                    _book(45, "Thinking, Fast and Slow", "Daniel Kahneman", 2011),
                    _book(46, "Predictably Irrational", "Dan Ariely", 2008),
                    _book(47, "Mistakes Were Made But Not By Me", "Carol Tavris", 2007),
                    _book(48, "The Happiness Hypothesis", "Jonathan Haidt", 2006),
                    _book(49, "The Mind Is Flat", "Nick Chater", 2018, counterpoint=True),
                ]
            },
            {
                "number": 2, "name": "Behavioral Psychology",
                "slug": "02-behavioral-psychology",
                "books": [
                    _book(50, "Influence", "Robert Cialdini", 1984),
                    _book(51, "Pre-Suasion", "Robert Cialdini", 2016),
                    _book(52, "Nudge", "Richard Thaler", 2008),
                    _book(53, "Misbehaving", "Richard Thaler", 2015),
                    _book(54, "The Power of Habit", "Charles Duhigg", 2012),
                ]
            },
            {
                "number": 3, "name": "Social Psychology",
                "slug": "03-social-psychology",
                "books": [
                    _book(55, "The Righteous Mind", "Jonathan Haidt", 2012),
                    _book(56, "The Social Animal", "Elliot Aronson", 1972),
                    _book(57, "Influence", "Robert Cialdini", 1984),
                    _book(58, "The Lucifer Effect", "Philip Zimbardo", 2007),
                    _book(59, "The Denial of Death", "Ernest Becker", 1973),
                ]
            },
            {
                "number": 4, "name": "Motivation & Emotion",
                "slug": "04-motivation-emotion",
                "books": [
                    _book(60, "Drive", "Daniel Pink", 2009),
                    _book(61, "Grit", "Angela Duckworth", 2016),
                    _book(62, "Flow", "Mihaly Csikszentmihalyi", 1990),
                    _book(63, "Emotional Intelligence", "Daniel Goleman", 1995),
                ]
            },
            {
                "number": 5, "name": "Personality & Individual Differences",
                "slug": "05-personality-individual-differences",
                "books": [
                    _book(64, "The Laws of Human Nature", "Robert Greene", 2018),
                    _book(65, "Grit", "Angela Duckworth", 2016),
                    _book(66, "Quiet", "Susan Cain", 2012, counterpoint=True),
                ]
            },
            {
                "number": 6, "name": "Developmental Psychology",
                "slug": "06-developmental-psychology",
                "books": [
                    _book(67, "The Whole-Brain Child", "Daniel Siegel", 2011),
                    _book(68, "How Children Succeed", "Paul Tough", 2012),
                    _book(69, "NurtureShock", "Bronson & Merryman", 2009),
                    _book(70, "The Gardener and the Carpenter", "Alison Gopnik", 2016),
                    _book(71, "Brainstorm", "Daniel Siegel", 2013),
                ]
            },
            {
                "number": 7, "name": "Positive Psychology",
                "slug": "07-positive-psychology",
                "books": [
                    _book(72, "Flow", "Mihaly Csikszentmihalyi", 1990),
                    _book(73, "The Happiness Advantage", "Shawn Achor", 2010),
                    _book(74, "Stumbling on Happiness", "Daniel Gilbert", 2006),
                    _book(75, "Authentic Happiness", "Martin Seligman", 2002),
                ]
            },
            {
                "number": 8, "name": "Clinical Psychology & Mental Health",
                "slug": "08-clinical-psychology-mental-health",
                "books": [
                    _book(76, "The Man Who Mistook His Wife for a Hat", "Oliver Sacks", 1985),
                    _book(77, "Lost Connections", "Johann Hari", 2018, counterpoint=True),
                    _book(78, "The Body Keeps the Score", "Bessel van der Kolk", 2014),
                ]
            },
            {
                "number": 9, "name": "Learning Theory",
                "slug": "09-learning-theory",
                "books": [
                    _book(79, "Make It Stick", "Peter C. Brown", 2014),
                    _book(80, "How We Learn", "Benedict Carey", 2014),
                    _book(81, "Why Don't Students Like School", "Daniel Willingham", 2009),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 03: DECISION MAKING & SYSTEMS THINKING
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 3, "name": "Decision Making & Systems Thinking",
        "slug": "03-decision-making-systems-thinking",
        "description": "Mental models, probability, risk, forecasting, rationality, game theory.",
        "subcategories": [
            {
                "number": 1, "name": "Mental Models",
                "slug": "01-mental-models",
                "books": [
                    _book(82, "Poor Charlie's Almanack", "Charlie Munger", 2005),
                    _book(83, "The Great Mental Models Vol. 1", "Shane Parrish", 2019),
                    _book(84, "The Great Mental Models Vol. 2", "Shane Parrish", 2020),
                    _book(85, "The Great Mental Models Vol. 3", "Shane Parrish", 2021),
                    _book(86, "Seeking Wisdom", "Peter Bevelin", 2003),
                ]
            },
            {
                "number": 2, "name": "Probability & Uncertainty",
                "slug": "02-probability-uncertainty",
                "books": [
                    _book(87, "Fooled by Randomness", "Nassim Taleb", 2001),
                    _book(88, "The Black Swan", "Nassim Taleb", 2007),
                    _book(89, "Antifragile", "Nassim Taleb", 2012, counterpoint=True),
                    _book(90, "Skin in the Game", "Nassim Taleb", 2018),
                    _book(91, "The Drunkard's Walk", "Leonard Mlodinow", 2008),
                    _book(92, "Against the Gods", "Peter Bernstein", 1996),
                ]
            },
            {
                "number": 3, "name": "Forecasting & Prediction",
                "slug": "03-forecasting-prediction",
                "books": [
                    _book(93, "Superforecasting", "Philip Tetlock", 2015),
                    _book(94, "The Scout Mindset", "Julia Galef", 2021),
                    _book(95, "Thinking in Bets", "Annie Duke", 2018),
                    _book(96, "How to Decide", "Annie Duke", 2020),
                    _book(97, "The Signal and the Noise", "Nate Silver", 2012),
                ]
            },
            {
                "number": 4, "name": "Risk & Resilience",
                "slug": "04-risk-resilience",
                "books": [
                    _book(98, "Antifragile", "Nassim Taleb", 2012),
                    _book(99, "Against the Gods", "Peter Bernstein", 1996),
                    _book(100, "The Logic of Failure", "Dietrich Dorner", 1989),
                    _book(101, "Normal Accidents", "Charles Perrow", 1984),
                ]
            },
            {
                "number": 5, "name": "Systems Thinking",
                "slug": "05-systems-thinking",
                "books": [
                    _book(102, "Thinking in Systems", "Donella Meadows", 2008),
                    _book(103, "The Fifth Discipline", "Peter Senge", 1990),
                    _book(104, "Algorithms to Live By", "Brian Christian", 2016),
                ]
            },
            {
                "number": 6, "name": "Cognitive Biases & Debiasing",
                "slug": "06-cognitive-biases-debiasing",
                "books": [
                    _book(105, "Thinking, Fast and Slow", "Daniel Kahneman", 2011),
                    _book(106, "Predictably Irrational", "Dan Ariely", 2008),
                    _book(107, "The Art of Thinking Clearly", "Rolf Dobelli", 2011),
                    _book(108, "You Are Not So Smart", "David McRaney", 2011),
                ]
            },
            {
                "number": 7, "name": "Rationality & Judgment",
                "slug": "07-rationality-judgment",
                "books": [
                    _book(109, "Superforecasting", "Philip Tetlock", 2015),
                    _book(110, "The Scout Mindset", "Julia Galef", 2021),
                    _book(111, "The Rationality Quotient", "Keith Stanovich", 2016),
                ]
            },
            {
                "number": 8, "name": "Game Theory",
                "slug": "08-game-theory",
                "books": [
                    _book(112, "The Art of Strategy", "Avinash Dixit", 2008),
                    _book(113, "Prisoner's Dilemma", "William Poundstone", 1992),
                    _book(114, "Game Theory", "Morton Davis", 1970),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 04: PHILOSOPHY & RELIGION
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 4, "name": "Philosophy & Religion",
        "slug": "04-philosophy-religion",
        "description": "Western, Eastern, and Indian philosophy, ethics, logic, religion.",
        "subcategories": [
            {
                "number": 1, "name": "Western Philosophy",
                "slug": "01-western-philosophy",
                "books": [
                    _book(115, "The Republic", "Plato", -375),
                    _book(116, "Nicomachean Ethics", "Aristotle", -350),
                    _book(117, "Meditations", "Marcus Aurelius", 180),
                    _book(118, "Letters from a Stoic", "Seneca", 65),
                    _book(119, "Beyond Good and Evil", "Friedrich Nietzsche", 1886),
                    _book(120, "The Problems of Philosophy", "Bertrand Russell", 1912),
                    _book(121, "The Denial of Death", "Ernest Becker", 1973),
                    _book(122, "Man's Search for Meaning", "Viktor Frankl", 1946),
                ]
            },
            {
                "number": 2, "name": "Indian Philosophy",
                "slug": "02-indian-philosophy",
                "books": [
                    _book(123, "Bhagavad Gita", "Tradition", -300),
                    _book(124, "The Principal Upanishads", "Tradition", -600),
                    _book(125, "Vivekachudamani", "Shankaracharya", 800),
                    _book(126, "The Essence of Advaita Vedanta", "Swami Sivananda", 1942),
                    _book(127, "I Am That", "Nisargadatta Maharaj", 1973),
                    _book(128, "Ashtavakra Gita", "Tradition", -400),
                ]
            },
            {
                "number": 3, "name": "Eastern Philosophy",
                "slug": "03-eastern-philosophy",
                "books": [
                    _book(129, "Tao Te Ching", "Lao Tzu", -500),
                    _book(130, "The Art of War", "Sun Tzu", -500),
                    _book(131, "The Way of Zen", "Alan Watts", 1957),
                    _book(132, "Zen Mind, Beginner's Mind", "Shunryu Suzuki", 1970),
                    _book(133, "Zen in the Art of Archery", "Eugen Herrigel", 1948),
                    _book(134, "Dhammapada", "Tradition", -250),
                ]
            },
            {
                "number": 4, "name": "Ethics & Moral Philosophy",
                "slug": "04-ethics-moral-philosophy",
                "books": [
                    _book(135, "The Righteous Mind", "Jonathan Haidt", 2012),
                    _book(136, "Justice", "Michael Sandel", 2009),
                    _book(137, "The Nicomachean Ethics", "Aristotle", -350),
                ]
            },
            {
                "number": 5, "name": "Logic & Critical Thinking",
                "slug": "05-logic-critical-thinking",
                "books": [
                    _book(138, "Tractatus Logico-Philosophicus", "Ludwig Wittgenstein", 1921),
                    _book(139, "Philosophical Investigations", "Ludwig Wittgenstein", 1953),
                    _book(140, "Godel's Proof", "Ernest Nagel", 1958),
                ]
            },
            {
                "number": 6, "name": "Religion & Spirituality",
                "slug": "06-religion-spirituality",
                "books": [
                    _book(141, "A History of God", "Karen Armstrong", 1993),
                    _book(142, "The Bible: A Biography", "Karen Armstrong", 2007),
                    _book(143, "The Great Transformation", "Karen Armstrong", 2006),
                    _book(144, "The Varieties of Religious Experience", "William James", 1902),
                ]
            },
            {
                "number": 7, "name": "Comparative Philosophy",
                "slug": "07-comparative-philosophy",
                "books": [
                    _book(145, "The Tao of Physics", "Fritjof Capra", 1975),
                    _book(146, "The Perennial Philosophy", "Aldous Huxley", 1945),
                    _book(147, "The World's Religions", "Huston Smith", 1958),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 05: HEALTH, MEDICINE & LIFE SCIENCES
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 5, "name": "Health, Medicine & Life Sciences",
        "slug": "05-health-medicine-life-sciences",
        "description": "Medicine, neuroscience, nutrition, fitness, sleep, longevity, biology.",
        "subcategories": [
            {
                "number": 1, "name": "Medicine & Clinical Science",
                "slug": "01-medicine-clinical-science",
                "books": [
                    _book(148, "The Emperor of All Maladies", "Siddhartha Mukherjee", 2010),
                    _book(149, "Being Mortal", "Atul Gawande", 2014),
                    _book(150, "How Doctors Think", "Jerome Groopman", 2007),
                ]
            },
            {
                "number": 2, "name": "Neuroscience & Brain Health",
                "slug": "02-neuroscience-brain-health",
                "books": [
                    _book(151, "The Tell-Tale Brain", "V.S. Ramachandran", 2010),
                    _book(152, "Phantoms in the Brain", "V.S. Ramachandran", 1998),
                    _book(153, "The Brain That Changes Itself", "Norman Doidge", 2007),
                    _book(154, "Descartes' Error", "Antonio Damasio", 1994),
                    _book(155, "Musicophilia", "Oliver Sacks", 2007),
                ]
            },
            {
                "number": 3, "name": "Nutrition & Diet",
                "slug": "03-nutrition-diet",
                "books": [
                    _book(156, "The Omnivore's Dilemma", "Michael Pollan", 2006),
                    _book(157, "In Defense of Food", "Michael Pollan", 2008),
                ]
            },
            {
                "number": 4, "name": "Exercise Science & Fitness",
                "slug": "04-exercise-science-fitness",
                "books": [
                    _book(158, "The Sports Gene", "David Epstein", 2013),
                    _book(159, "Born to Run", "Christopher McDougall", 2009),
                ]
            },
            {
                "number": 5, "name": "Sleep Science",
                "slug": "05-sleep-science",
                "books": [
                    _book(160, "Why We Sleep", "Matthew Walker", 2017),
                    _book(161, "The Sleep Revolution", "Arianna Huffington", 2016),
                ]
            },
            {
                "number": 6, "name": "Longevity & Aging",
                "slug": "06-longevity-aging",
                "books": [
                    _book(162, "Lifespan", "David Sinclair", 2019),
                    _book(163, "The Telomere Effect", "Elizabeth Blackburn", 2017),
                    _book(164, "Ageless", "Andrew Steele", 2021),
                ]
            },
            {
                "number": 7, "name": "Biology & Life Sciences",
                "slug": "07-biology-life-sciences",
                "books": [
                    _book(165, "The Selfish Gene", "Richard Dawkins", 1976),
                    _book(166, "The Gene", "Siddhartha Mukherjee", 2016),
                    _book(167, "Genome", "Matt Ridley", 1999),
                    _book(168, "The Extended Phenotype", "Richard Dawkins", 1982),
                    _book(169, "On the Origin of Species", "Charles Darwin", 1859),
                ]
            },
            {
                "number": 8, "name": "Psychology & Mental Health",
                "slug": "08-psychology-mental-health",
                "books": [
                    _book(170, "Lost Connections", "Johann Hari", 2018),
                    _book(171, "The Body Keeps the Score", "Bessel van der Kolk", 2014),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 06: FINANCE & INVESTING
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 6, "name": "Finance & Investing",
        "slug": "06-finance-investing",
        "description": "Personal finance, value investing, index investing, behavioral finance, markets.",
        "subcategories": [
            {
                "number": 1, "name": "Personal Finance & Wealth Building",
                "slug": "01-personal-finance-wealth-building",
                "books": [
                    _book(172, "The Psychology of Money", "Morgan Housel", 2020),
                    _book(173, "The Millionaire Next Door", "Thomas Stanley", 1996),
                    _book(174, "The Richest Man in Babylon", "George Clason", 1926),
                    _book(175, "I Will Teach You to Be Rich", "Ramit Sethi", 2009),
                    _book(176, "Your Money or Your Life", "Vicki Robin", 2008),
                    _book(177, "The Simple Path to Wealth", "JL Collins", 2016),
                    _book(178, "Die With Zero", "Bill Perkins", 2020, counterpoint=True),
                    _book(179, "Rich Dad Poor Dad", "Robert Kiyosaki", 1997),
                ]
            },
            {
                "number": 2, "name": "Value Investing",
                "slug": "02-value-investing",
                "books": [
                    _book(180, "The Intelligent Investor", "Benjamin Graham", 1949),
                    _book(181, "Security Analysis", "Benjamin Graham", 1934),
                    _book(182, "Common Stocks and Uncommon Profits", "Philip Fisher", 1958),
                    _book(183, "One Up On Wall Street", "Peter Lynch", 1989),
                    _book(184, "The Most Important Thing", "Howard Marks", 2011),
                    _book(185, "The Warren Buffett Way", "Robert Hagstrom", 1994),
                    _book(186, "Margin of Safety", "Seth Klarman", 1991),
                ]
            },
            {
                "number": 3, "name": "Index Investing & Passive Strategies",
                "slug": "03-index-investing-passive",
                "books": [
                    _book(187, "A Random Walk Down Wall Street", "Burton Malkiel", 1973),
                    _book(188, "The Little Book of Common Sense Investing", "John Bogle", 2007),
                    _book(189, "Stocks for the Long Run", "Jeremy Siegel", 1994),
                    _book(190, "Common Sense on Mutual Funds", "John Bogle", 1999),
                ]
            },
            {
                "number": 4, "name": "Behavioral Finance",
                "slug": "04-behavioral-finance",
                "books": [
                    _book(191, "Misbehaving", "Richard Thaler", 2015),
                    _book(192, "Nudge", "Richard Thaler", 2008),
                    _book(193, "The Psychology of Money", "Morgan Housel", 2020),
                    _book(194, "Fooled by Randomness", "Nassim Taleb", 2001),
                ]
            },
            {
                "number": 5, "name": "Advanced & Contrarian Investing",
                "slug": "05-advanced-contrarian-investing",
                "books": [
                    _book(195, "100 Baggers", "Christopher Mayer", 2015),
                    _book(196, "Coffee Can Investing", "Saurabh Mukherjea", 2018),
                    _book(197, "The Dhando Investor", "Mohnish Pabrai", 2007),
                    _book(198, "The Bitcoin Standard", "Saifedean Ammous", 2018, counterpoint=True),
                    _book(199, "Flash Boys", "Michael Lewis", 2014),
                    _book(200, "When Genius Failed", "Roger Lowenstein", 2000),
                ]
            },
            {
                "number": 6, "name": "Risk Management",
                "slug": "06-risk-management",
                "books": [
                    _book(201, "Against the Gods", "Peter Bernstein", 1996),
                    _book(202, "The Black Swan", "Nassim Taleb", 2007),
                    _book(203, "Fooled by Randomness", "Nassim Taleb", 2001),
                    _book(204, "The Logic of Failure", "Dietrich Dorner", 1989),
                ]
            },
            {
                "number": 7, "name": "Quantitative Finance",
                "slug": "07-quantitative-finance",
                "books": [
                    _book(205, "The Quants", "Scott Patterson", 2010),
                    _book(206, "More Money Than God", "Sebastian Mallaby", 2010),
                    _book(207, "Hedge Fund Market Wizards", "Jack Schwager", 2012),
                ]
            },
            {
                "number": 8, "name": "Financial History",
                "slug": "08-financial-history",
                "books": [
                    _book(208, "The Ascent of Money", "Niall Ferguson", 2008),
                    _book(209, "Liar's Poker", "Michael Lewis", 1989),
                    _book(210, "The Big Short", "Michael Lewis", 2010),
                    _book(211, "Moneyball", "Michael Lewis", 2003),
                ]
            },
            {
                "number": 9, "name": "Venture Capital & Private Equity",
                "slug": "09-venture-capital-private-equity",
                "books": [
                    _book(212, "Venture Deals", "Brad Feld", 2011),
                    _book(213, "The Hard Thing About Hard Things", "Ben Horowitz", 2014),
                    _book(214, "Zero to One", "Peter Thiel", 2014),
                ]
            },
            {
                "number": 10, "name": "Real Estate Investing",
                "slug": "10-real-estate-investing",
                "books": [
                    _book(215, "The Millionaire Real Estate Investor", "Gary Keller", 2005),
                    _book(216, "Rich Dad's Guide to Investing", "Robert Kiyosaki", 2000),
                ]
            },
            {
                "number": 11, "name": "Indian Finance",
                "slug": "11-indian-finance",
                "books": [
                    _book(217, "Coffee Can Investing", "Saurabh Mukherjea", 2018),
                    _book(218, "The Unusual Billionaires", "Saurabh Mukherjea", 2016),
                ]
            },
            {
                "number": 12, "name": "Fixed Income & Derivatives",
                "slug": "12-fixed-income-derivatives",
                "books": [
                    _book(219, "Options, Futures, and Other Derivatives", "John Hull", 1989),
                    _book(220, "Fixed Income Securities", "Bruce Tuckman", 2002),
                ]
            },
            {
                "number": 13, "name": "Alternative Investments",
                "slug": "13-alternative-investments",
                "books": [
                    _book(221, "The Bitcoin Standard", "Saifedean Ammous", 2018),
                    _book(222, "More Money Than God", "Sebastian Mallaby", 2010),
                    _book(223, "Hedge Hogs", "Barbara Dreyfuss", 2013),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 07: BUSINESS, MANAGEMENT & ENTREPRENEURSHIP
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 7, "name": "Business, Management & Entrepreneurship",
        "slug": "07-business-management-entrepreneurship",
        "description": "Startups, strategy, leadership, marketing, operations, product management.",
        "subcategories": [
            {
                "number": 1, "name": "Entrepreneurship & Startups",
                "slug": "01-entrepreneurship-startups",
                "books": [
                    _book(224, "Zero to One", "Peter Thiel", 2014),
                    _book(225, "The Lean Startup", "Eric Ries", 2011),
                    _book(226, "Rework", "Jason Fried", 2010),
                    _book(227, "Company of One", "Paul Jarvis", 2019),
                    _book(228, "The Mom Test", "Rob Fitzpatrick", 2013),
                    _book(229, "The Hard Thing About Hard Things", "Ben Horowitz", 2014),
                    _book(230, "Founders at Work", "Jessica Livingston", 2007),
                    _book(231, "The E-Myth Revisited", "Michael Gerber", 1995),
                    _book(232, "Disciplined Entrepreneurship", "Bill Aulet", 2013),
                    _book(233, "The Startup Owner's Manual", "Steve Blank", 2012),
                    _book(234, "The Personal MBA", "Josh Kaufman", 2010),
                ]
            },
            {
                "number": 2, "name": "Business Strategy",
                "slug": "02-business-strategy",
                "books": [
                    _book(235, "Good Strategy Bad Strategy", "Richard Rumelt", 2011),
                    _book(236, "Blue Ocean Strategy", "W. Chan Kim", 2005),
                    _book(237, "The Innovator's Dilemma", "Clayton Christensen", 1997),
                    _book(238, "Crossing the Chasm", "Geoffrey Moore", 1991),
                    _book(239, "Positioning", "Al Ries", 1981),
                ]
            },
            {
                "number": 3, "name": "Leadership & Executive Development",
                "slug": "03-leadership-executive-development",
                "books": [
                    _book(240, "High Output Management", "Andy Grove", 1995),
                    _book(241, "Extreme Ownership", "Jocko Willink", 2015),
                    _book(242, "Leaders Eat Last", "Simon Sinek", 2014),
                    _book(243, "Radical Candor", "Kim Scott", 2017),
                    _book(244, "Multipliers", "Liz Wiseman", 2010),
                    _book(245, "Dare to Lead", "Brene Brown", 2018),
                    _book(246, "The First 90 Days", "Michael Watkins", 2003),
                    _book(247, "The Five Dysfunctions of a Team", "Patrick Lencioni", 2002),
                    _book(248, "Turn the Ship Around", "L. David Marquet", 2012),
                ]
            },
            {
                "number": 4, "name": "Management & Organizational Behavior",
                "slug": "04-management-organizational-behavior",
                "books": [
                    _book(249, "The Effective Executive", "Peter Drucker", 1967),
                    _book(250, "High Output Management", "Andy Grove", 1995),
                    _book(251, "Measure What Matters", "John Doerr", 2017),
                    _book(252, "Drive", "Daniel Pink", 2009),
                ]
            },
            {
                "number": 5, "name": "Marketing & Brand Strategy",
                "slug": "05-marketing-brand-strategy",
                "books": [
                    _book(253, "Positioning", "Al Ries", 1981),
                    _book(254, "Building a StoryBrand", "Donald Miller", 2017),
                    _book(255, "Made to Stick", "Chip Heath", 2007),
                    _book(256, "Ogilvy on Advertising", "David Ogilvy", 1983),
                    _book(257, "Scientific Advertising", "Claude Hopkins", 1923),
                    _book(258, "Traction", "Gabriel Weinberg", 2014),
                    _book(259, "The Copywriter's Handbook", "Robert Bly", 1985),
                    _book(260, "The Boron Letters", "Gary Halbert", 1997),
                    _book(261, "Everybody Writes", "Ann Handley", 2014),
                    _book(262, "Storyworthy", "Matthew Dicks", 2018),
                ]
            },
            {
                "number": 6, "name": "Operations & Supply Chain",
                "slug": "06-operations-supply-chain",
                "books": [
                    _book(263, "The Goal", "Eliyahu Goldratt", 1984),
                    _book(264, "The Checklist Manifesto", "Atul Gawande", 2009),
                ]
            },
            {
                "number": 7, "name": "Product Management",
                "slug": "07-product-management",
                "books": [
                    _book(265, "The Mom Test", "Rob Fitzpatrick", 2013),
                    _book(266, "Inspired", "Marty Cagan", 2017),
                    _book(267, "The Change Function", "Pip Coburn", 2006),
                ]
            },
            {
                "number": 8, "name": "Sales & Business Development",
                "slug": "08-sales-business-development",
                "books": [
                    _book(268, "SPIN Selling", "Neil Rackham", 1988),
                    _book(269, "The Challenger Sale", "Matthew Dixon", 2011),
                ]
            },
            {
                "number": 9, "name": "Corporate Finance & Accounting",
                "slug": "09-corporate-finance-accounting",
                "books": [
                    _book(270, "The Interpretation of Financial Statements", "Benjamin Graham", 1937),
                    _book(271, "Financial Intelligence", "Karen Berman", 2006),
                ]
            },
            {
                "number": 10, "name": "Consulting & Frameworks",
                "slug": "10-consulting-frameworks",
                "books": [
                    _book(272, "The McKinsey Way", "Ethan Rasiel", 1999),
                    _book(273, "The Pyramid Principle", "Barbara Minto", 1987),
                    _book(274, "Case Interview Secrets", "Victor Cheng", 2012),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 08: COMMUNICATION, LANGUAGE & WRITING
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 8, "name": "Communication, Language & Writing",
        "slug": "08-communication-language-writing",
        "description": "Writing craft, storytelling, persuasion, rhetoric, public speaking, linguistics.",
        "subcategories": [
            {
                "number": 1, "name": "Writing Craft",
                "slug": "01-writing-craft",
                "books": [
                    _book(275, "On Writing Well", "William Zinsser", 1976),
                    _book(276, "The Elements of Style", "Strunk & White", 1918),
                    _book(277, "Everybody Writes", "Ann Handley", 2014),
                    _book(278, "The Pyramid Principle", "Barbara Minto", 1987),
                    _book(279, "On Writing", "Stephen King", 2000),
                ]
            },
            {
                "number": 2, "name": "Nonfiction Writing",
                "slug": "02-nonfiction-writing",
                "books": [
                    _book(280, "On Writing Well", "William Zinsser", 1976),
                    _book(281, "The Art of Memoir", "Mary Karr", 2015),
                    _book(282, "Storycraft", "Jack Hart", 2011),
                ]
            },
            {
                "number": 3, "name": "Storytelling",
                "slug": "03-storytelling",
                "books": [
                    _book(283, "Storyworthy", "Matthew Dicks", 2018),
                    _book(284, "Made to Stick", "Chip Heath", 2007),
                    _book(285, "The Storytelling Animal", "Jonathan Gottschall", 2012),
                    _book(286, "Building a StoryBrand", "Donald Miller", 2017),
                ]
            },
            {
                "number": 4, "name": "Persuasion & Rhetoric",
                "slug": "04-persuasion-rhetoric",
                "books": [
                    _book(287, "How to Win Friends and Influence People", "Dale Carnegie", 1936),
                    _book(288, "Never Split the Difference", "Chris Voss", 2016),
                    _book(289, "Influence", "Robert Cialdini", 1984),
                    _book(290, "Thank You for Arguing", "Jay Heinrichs", 2007),
                    _book(291, "Words That Work", "Frank Luntz", 2007),
                    _book(292, "Influence Is Your Superpower", "Zoe Chance", 2022),
                ]
            },
            {
                "number": 5, "name": "Public Speaking & Presentation",
                "slug": "05-public-speaking-presentation",
                "books": [
                    _book(293, "Talk Like TED", "Carmine Gallo", 2014),
                    _book(294, "Presentation Zen", "Garr Reynolds", 2008),
                    _book(295, "Resonate", "Nancy Duarte", 2010),
                    _book(296, "The Charisma Myth", "Olivia Fox Cabane", 2012),
                ]
            },
            {
                "number": 6, "name": "Communication Theory",
                "slug": "06-communication-theory",
                "books": [
                    _book(297, "Crucial Conversations", "Patterson Grenny", 2002),
                    _book(298, "Difficult Conversations", "Douglas Stone", 1999),
                ]
            },
            {
                "number": 7, "name": "Linguistics",
                "slug": "07-linguistics",
                "books": [
                    _book(299, "The Language Instinct", "Steven Pinker", 1994),
                    _book(300, "Through the Language Glass", "Guy Deutscher", 2010),
                ]
            },
            {
                "number": 8, "name": "Language Learning",
                "slug": "08-language-learning",
                "books": [
                    _book(301, "Fluent Forever", "Gabriel Wyner", 2014),
                    _book(302, "How to Learn Any Language", "Barry Farber", 1991),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 09: HISTORY, SOCIETY & POLITICS
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 9, "name": "History, Society & Politics",
        "slug": "09-history-society-politics",
        "description": "World history, civilizations, sociology, political science, geopolitics.",
        "subcategories": [
            {
                "number": 1, "name": "World History & Civilizations",
                "slug": "01-world-history-civilizations",
                "books": [
                    _book(303, "Sapiens", "Yuval Noah Harari", 2011),
                    _book(304, "Guns, Germs, and Steel", "Jared Diamond", 1997),
                    _book(305, "The Lessons of History", "Will Durant", 1968),
                    _book(306, "The Silk Roads", "Peter Frankopan", 2015),
                    _book(307, "The Dawn of Everything", "David Graeber", 2021, counterpoint=True),
                    _book(308, "Homo Deus", "Yuval Noah Harari", 2016),
                    _book(309, "The WEIRDest People in the World", "Joseph Henrich", 2020),
                ]
            },
            {
                "number": 2, "name": "History of Ideas & Intellectual History",
                "slug": "02-history-ideas-intellectual-history",
                "books": [
                    _book(310, "The Structure of Scientific Revolutions", "Thomas Kuhn", 1962),
                    _book(311, "Against Method", "Paul Feyerabend", 1975),
                    _book(312, "The Copernican Revolution", "Thomas Kuhn", 1957),
                    _book(313, "The Essential Tension", "Thomas Kuhn", 1977),
                    _book(314, "The Road Since Structure", "Thomas Kuhn", 2000),
                    _book(315, "The Scientific Revolution", "Steven Shapin", 1996),
                    _book(316, "Leviathan and the Air-Pump", "Shapin & Schaffer", 1985),
                    _book(317, "Science and the Modern World", "Alfred North Whitehead", 1925),
                ]
            },
            {
                "number": 3, "name": "Sociology",
                "slug": "03-sociology",
                "books": [
                    _book(318, "The Protestant Ethic and the Spirit of Capitalism", "Max Weber", 1905),
                    _book(319, "The Division of Labor in Society", "Emile Durkheim", 1893),
                    _book(320, "The Interpretation of Cultures", "Clifford Geertz", 1973),
                    _book(321, "The Culture of Fear", "Barry Glassner", 1999),
                    _book(322, "Bowling Alone", "Robert Putnam", 2000),
                ]
            },
            {
                "number": 4, "name": "Anthropology",
                "slug": "04-anthropology",
                "books": [
                    _book(323, "The Dawn of Everything", "David Graeber", 2021),
                    _book(324, "Debt: The First 5000 Years", "David Graeber", 2011),
                ]
            },
            {
                "number": 5, "name": "Political Science",
                "slug": "05-political-science",
                "books": [
                    _book(325, "The Prince", "Niccolo Machiavelli", 1532),
                    _book(326, "The Social Contract", "Jean-Jacques Rousseau", 1762),
                    _book(327, "Democracy in America", "Alexis de Tocqueville", 1835),
                    _book(328, "Leviathan", "Thomas Hobbes", 1651),
                    _book(329, "The Clash of Civilizations", "Samuel Huntington", 1996),
                    _book(330, "The End of History", "Francis Fukuyama", 1992),
                ]
            },
            {
                "number": 6, "name": "Geopolitics & International Relations",
                "slug": "06-geopolitics-international-relations",
                "books": [
                    _book(331, "The Tragedy of Great Power Politics", "John Mearsheimer", 2001),
                    _book(332, "The Israel Lobby", "Mearsheimer & Walt", 2007),
                    _book(333, "The Great Delusion", "John Mearsheimer", 2018),
                    _book(334, "Theory of International Politics", "Kenneth Waltz", 1979),
                    _book(335, "The Anarchical Society", "Hedley Bull", 1977),
                    _book(336, "Politics Among Nations", "Hans Morgenthau", 1948),
                    _book(337, "After Hegemony", "Robert Keohane", 1984),
                    _book(338, "War and Change in World Politics", "Robert Gilpin", 1981),
                    _book(339, "Orientalism", "Edward Said", 1978),
                    _book(340, "The World Is Flat", "Thomas Friedman", 2005),
                    _book(341, "The Lexus and the Olive Tree", "Thomas Friedman", 1999),
                    _book(342, "Jihad vs. McWorld", "Benjamin Barber", 1995),
                    _book(343, "The Great Divergence", "Kenneth Pomeranz", 2000),
                    _book(344, "Political Order in Changing Societies", "Samuel Huntington", 1968),
                    _book(345, "The Soldier and the State", "Samuel Huntington", 1957),
                    _book(346, "Who Are We?", "Samuel Huntington", 2004),
                ]
            },
            {
                "number": 7, "name": "Public Policy & Governance",
                "slug": "07-public-policy-governance",
                "books": [
                    _book(347, "Why Nations Fail", "Daron Acemoglu", 2012),
                    _book(348, "Capitalism and Freedom", "Milton Friedman", 1962),
                    _book(349, "Free to Choose", "Milton Friedman", 1980),
                    _book(350, "The Road to Serfdom", "Friedrich Hayek", 1944),
                ]
            },
            {
                "number": 8, "name": "Biography & Memoir (History)",
                "slug": "08-biography-memoir-history",
                "books": [
                    _book(351, "Team of Rivals", "Doris Kearns Goodwin", 2005),
                    _book(352, "The Autobiography of Malcolm X", "Malcolm X", 1965),
                    _book(353, "Long Walk to Freedom", "Nelson Mandela", 1994),
                    _book(354, "Becoming", "Michelle Obama", 2018),
                    _book(355, "Genghis Khan", "Jack Weatherford", 2004),
                ]
            },
            {
                "number": 9, "name": "Cultural Studies",
                "slug": "09-cultural-studies",
                "books": [
                    _book(356, "The Second Sex", "Simone de Beauvoir", 1949),
                    _book(357, "World-Systems Analysis", "Immanuel Wallerstein", 2004),
                    _book(358, "The Empty Cradle", "Phillip Longman", 2004),
                ]
            },
            {
                "number": 10, "name": "Law & Legal Systems",
                "slug": "10-law-legal-systems",
                "books": [
                    _book(359, "The Concept of Law", "HLA Hart", 1961),
                    _book(360, "The Common Law Tradition", "Karl Llewellyn", 1960),
                    _book(361, "The Constitution of India", "B.R. Ambedkar", 1950),
                    _book(362, "International Law", "Malcolm Shaw", 1977),
                    _book(363, "The Modern Corporation and Private Property", "Berle & Means", 1932),
                    _book(364, "The Justice Game", "Geoffrey Robertson", 1998),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 10: MATHEMATICS, SCIENCE & TECHNOLOGY
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 10, "name": "Mathematics, Science & Technology",
        "slug": "10-mathematics-science-technology",
        "description": "Math, physics, chemistry, CS, software engineering, AI, systems design.",
        "subcategories": [
            {
                "number": 1, "name": "Mathematics",
                "slug": "01-mathematics",
                "books": [
                    _book(365, "Calculus", "Michael Spivak", 1967),
                    _book(366, "Principles of Mathematical Analysis", "Walter Rudin", 1953),
                    _book(367, "Linear Algebra Done Right", "Sheldon Axler", 1995),
                    _book(368, "How Not to Be Wrong", "Jordan Ellenberg", 2014),
                    _book(369, "Infinite Powers", "Steven Strogatz", 2019),
                    _book(370, "A Mind for Numbers", "Barbara Oakley", 2014),
                    _book(371, "The Art of Computer Programming Vol. 1", "Donald Knuth", 1968),
                    _book(372, "The Art of Computer Programming Vol. 2", "Donald Knuth", 1969),
                ]
            },
            {
                "number": 2, "name": "Statistics & Probability",
                "slug": "02-statistics-probability",
                "books": [
                    _book(373, "Naked Statistics", "Charles Wheelan", 2013),
                    _book(374, "Practical Statistics for Data Scientists", "Peter Bruce", 2017),
                    _book(375, "Introduction to Probability", "Joseph Blitzstein", 2014),
                    _book(376, "The Drunkard's Walk", "Leonard Mlodinow", 2008),
                    _book(377, "Mathematics for Machine Learning", "Marc Deisenroth", 2020),
                ]
            },
            {
                "number": 3, "name": "Physics",
                "slug": "03-physics",
                "books": [
                    _book(378, "A Brief History of Time", "Stephen Hawking", 1988),
                    _book(379, "The Feynman Lectures on Physics, Vol. I", "Richard Feynman", 1963),
                    _book(380, "Seven Brief Lessons on Physics", "Carlo Rovelli", 2014),
                    _book(381, "The Order of Time", "Carlo Rovelli", 2017),
                    _book(382, "Something Deeply Hidden", "Sean Carroll", 2019),
                    _book(383, "Reality Is Not What It Seems", "Carlo Rovelli", 2014),
                    _book(384, "The Character of Physical Law", "Richard Feynman", 1965),
                ]
            },
            {
                "number": 4, "name": "Chemistry",
                "slug": "04-chemistry",
                "books": [
                    _book(385, "The Disappearing Spoon", "Sam Kean", 2010),
                    _book(386, "Napoleon's Buttons", "Penny Le Couteur", 2003),
                    _book(387, "The Periodic Table", "Primo Levi", 1975),
                ]
            },
            {
                "number": 5, "name": "Popular Science",
                "slug": "05-popular-science",
                "books": [
                    _book(388, "A Short History of Nearly Everything", "Bill Bryson", 2003),
                    _book(389, "Cosmos", "Carl Sagan", 1980),
                    _book(390, "The Emperor of All Maladies", "Siddhartha Mukherjee", 2010),
                    _book(391, "The Selfish Gene", "Richard Dawkins", 1976),
                ]
            },
            {
                "number": 6, "name": "Computer Science",
                "slug": "06-computer-science",
                "books": [
                    _book(392, "The Pragmatic Programmer", "Andrew Hunt", 1999),
                    _book(393, "Structure and Interpretation of Computer Programs", "Hal Abelson", 1984),
                    _book(394, "Code", "Charles Petzold", 1999),
                    _book(395, "Computer Systems: A Programmer's Perspective", "Randal Bryant", 2015),
                    _book(396, "The Mythical Man-Month", "Fred Brooks", 1975),
                    _book(397, "Godel, Escher, Bach", "Douglas Hofstadter", 1979),
                ]
            },
            {
                "number": 7, "name": "Software Engineering",
                "slug": "07-software-engineering",
                "books": [
                    _book(398, "Clean Code", "Robert Martin", 2008),
                    _book(399, "Code Complete", "Steve McConnell", 1993),
                    _book(400, "Refactoring", "Martin Fowler", 1999),
                    _book(401, "Working Effectively with Legacy Code", "Michael Feathers", 2004),
                    _book(402, "Clean Architecture", "Robert Martin", 2017),
                    _book(403, "A Philosophy of Software Design", "John Ousterhout", 2018),
                    _book(404, "Design Patterns", "Gang of Four", 1994),
                    _book(405, "Head First Design Patterns", "Eric Freeman", 2004),
                    _book(406, "Clean Agile", "Robert Martin", 2019),
                    _book(407, "The Art of Readable Code", "Dustin Boswell", 2011),
                ]
            },
            {
                "number": 8, "name": "System Design & Scalability",
                "slug": "08-system-design-scalability",
                "books": [
                    _book(408, "Designing Data-Intensive Applications", "Martin Kleppmann", 2017),
                    _book(409, "System Design Interview Vol. 1", "Alex Xu", 2020),
                    _book(410, "System Design Interview Vol. 2", "Alex Xu", 2022),
                    _book(411, "The Art of Scalability", "Martin Abbott", 2009),
                    _book(412, "Web Scalability for Startup Engineers", "Artur Ejsmont", 2015),
                ]
            },
            {
                "number": 9, "name": "AI & Machine Learning",
                "slug": "09-ai-machine-learning",
                "books": [
                    _book(413, "Artificial Intelligence: A Modern Approach", "Stuart Russell", 1995),
                    _book(414, "Hands-On Machine Learning", "Aurelien Geron", 2019),
                    _book(415, "Pattern Recognition and Machine Learning", "Christopher Bishop", 2006),
                    _book(416, "Deep Learning", "Ian Goodfellow", 2016),
                    _book(417, "Deep Learning with Python", "Francois Chollet", 2017),
                    _book(418, "Designing Machine Learning Systems", "Chip Huyen", 2022),
                    _book(419, "Machine Learning Engineering", "Andriy Burkov", 2020),
                ]
            },
            {
                "number": 10, "name": "Data & Algorithms",
                "slug": "10-data-algorithms",
                "books": [
                    _book(420, "Introduction to Algorithms", "Thomas Cormen", 1990),
                    _book(421, "Grokking Algorithms", "Aditya Bhargava", 2016),
                    _book(422, "The Algorithm Design Manual", "Steven Skiena", 1998),
                    _book(423, "Programming Pearls", "Jon Bentley", 1986),
                    _book(424, "Building a Large Language Model From Scratch", "Sebastian Raschka", 2024),
                    _book(425, "Natural Language Processing with Transformers", "Lewis Tunstall", 2022),
                ]
            },
            {
                "number": 11, "name": "DevOps, SRE & Platform Engineering",
                "slug": "11-devops-sre-platform-engineering",
                "books": [
                    _book(426, "Site Reliability Engineering", "Betsy Beyer", 2016),
                    _book(427, "Accelerate", "Nicole Forsgren", 2018),
                    _book(428, "Release It!", "Michael Nygard", 2007),
                    _book(429, "Software Engineering at Google", "Titus Winters", 2020),
                    _book(430, "Staff Engineer", "Will Larson", 2021),
                    _book(431, "The Software Engineer's Guidebook", "Gergely Orosz", 2023),
                ]
            },
            {
                "number": 12, "name": "Networking & Distributed Systems",
                "slug": "12-networking-distributed-systems",
                "books": [
                    _book(432, "Computer Networking: A Top-Down Approach", "James Kurose", 2000),
                    _book(433, "TCP/IP Illustrated Vol. 1", "Kevin Fall", 1994),
                    _book(434, "Network Warrior", "Gary Donahue", 2007),
                    _book(435, "High Performance Browser Networking", "Ilya Grigorik", 2013),
                    _book(436, "Understanding Distributed Systems", "Roberto Vitillo", 2021),
                    _book(437, "Building Microservices", "Sam Newman", 2015),
                    _book(438, "Designing Distributed Systems", "Brendan Burns", 2018),
                    _book(439, "Monolith to Microservices", "Sam Newman", 2019),
                    _book(440, "Database Internals", "Alex Petrov", 2019),
                ]
            },
            {
                "number": 13, "name": "Cybersecurity",
                "slug": "13-cybersecurity",
                "books": [
                    _book(441, "Practical Binary Analysis", "Dennis Andriesse", 2018),
                    _book(442, "The Web Application Hacker's Handbook", "Dafydd Stuttard", 2007),
                ]
            },
            {
                "number": 14, "name": "Engineering (General)",
                "slug": "14-engineering-general",
                "books": [
                    _book(443, "The Art of Electronics", "Paul Horowitz", 1980),
                    _book(444, "The Prize", "Daniel Yergin", 1990),
                    _book(445, "The Innovator's Dilemma", "Clayton Christensen", 1997),
                    _book(446, "Introduction to Robotics", "John Craig", 1986),
                ]
            },
        ]
    })

    # ═════════════════════════════════════════════════════════════════
    # 11: ARTS, MEDIA, BIOGRAPHY & FICTION
    # ═════════════════════════════════════════════════════════════════
    cats.append({
        "number": 11, "name": "Arts, Media, Biography & Fiction",
        "slug": "11-arts-media-biography-fiction",
        "description": "Fiction, poetry, drama, music, film, design, biography, literary criticism.",
        "subcategories": [
            {
                "number": 1, "name": "Fiction",
                "slug": "01-fiction",
                "books": [
                    _book(447, "1984", "George Orwell", 1949),
                    _book(448, "The Lord of the Rings", "J.R.R. Tolkien", 1954),
                    _book(449, "Dune", "Frank Herbert", 1965),
                    _book(450, "Dracula", "Bram Stoker", 1897),
                    _book(451, "The Complete Sherlock Holmes", "Arthur Conan Doyle", 1892),
                ]
            },
            {
                "number": 2, "name": "Literary Fiction",
                "slug": "02-literary-fiction",
                "books": [
                    _book(452, "1984", "George Orwell", 1949),
                    _book(453, "Brave New World", "Aldous Huxley", 1932),
                ]
            },
            {
                "number": 3, "name": "Fantasy & Science Fiction",
                "slug": "03-fantasy-science-fiction",
                "books": [
                    _book(454, "The Lord of the Rings", "J.R.R. Tolkien", 1954),
                    _book(455, "Dune", "Frank Herbert", 1965),
                ]
            },
            {
                "number": 4, "name": "Poetry & Drama",
                "slug": "04-poetry-drama",
                "books": [
                    _book(456, "Poetics", "Aristotle", -335),
                    _book(457, "The Complete Works of William Shakespeare", "William Shakespeare", 1623),
                ]
            },
            {
                "number": 5, "name": "Film & Media",
                "slug": "05-film-media",
                "books": [
                    _book(458, "The Rest Is Noise", "Alex Ross", 2007),
                    _book(459, "The Song Machine", "John Seabrook", 2015),
                ]
            },
            {
                "number": 6, "name": "Music",
                "slug": "06-music",
                "books": [
                    _book(460, "This Is Your Brain on Music", "Daniel Levitin", 2006),
                    _book(461, "Musicophilia", "Oliver Sacks", 2007),
                    _book(462, "The World in Six Songs", "Daniel Levitin", 2008),
                    _book(463, "How Music Works", "David Byrne", 2012),
                    _book(464, "The Music Instinct", "Philip Ball", 2010),
                    _book(465, "Music and the Mind", "Anthony Storr", 1992),
                    _book(466, "Beethoven: The Universal Composer", "Edmund Morris", 2005),
                    _book(467, "A History of Western Music", "Grout & Palisca", 1960),
                ]
            },
            {
                "number": 7, "name": "Art, Design & Photography",
                "slug": "07-art-design-photography",
                "books": [
                    _book(468, "The Design of Everyday Things", "Don Norman", 1988),
                    _book(469, "Emotional Design", "Don Norman", 2004),
                    _book(470, "The Design of Future Things", "Don Norman", 2007),
                    _book(471, "Living with Complexity", "Don Norman", 2010),
                    _book(472, "Don't Make Me Think", "Steve Krug", 2000),
                    _book(473, "The Inmates Are Running the Asylum", "Alan Cooper", 1999),
                    _book(474, "About Face", "Alan Cooper", 1995),
                    _book(475, "Universal Principles of Design", "Lidwell & Holden", 2003),
                    _book(476, "100 Things Every Designer Needs", "Susan Weinschenk", 2011),
                    _book(477, "Thinking with Type", "Ellen Lupton", 2004),
                ]
            },
            {
                "number": 8, "name": "Biography & Memoir",
                "slug": "08-biography-memoir",
                "books": [
                    _book(478, "Steve Jobs", "Walter Isaacson", 2011),
                    _book(479, "Einstein: His Life and Universe", "Walter Isaacson", 2007),
                    _book(480, "Surely You're Joking, Mr. Feynman", "Richard Feynman", 1985),
                    _book(481, "The Innovators", "Walter Isaacson", 2014),
                    _book(482, "Just Kids", "Patti Smith", 2010),
                    _book(483, "Becoming", "Michelle Obama", 2018),
                    _book(484, "Long Walk to Freedom", "Nelson Mandela", 1994),
                    _book(485, "The Autobiography of Malcolm X", "Malcolm X", 1965),
                ]
            },
            {
                "number": 9, "name": "Literary Criticism & Theory",
                "slug": "09-literary-criticism-theory",
                "books": [
                    _book(486, "Literary Theory: An Introduction", "Terry Eagleton", 1983),
                    _book(487, "Beginning Theory", "Peter Barry", 1995),
                    _book(488, "Marxism and Literary Criticism", "Terry Eagleton", 1976),
                    _book(489, "The Function of Criticism", "Terry Eagleton", 1984),
                    _book(490, "After Theory", "Terry Eagleton", 2003),
                    _book(491, "How to Read Literature", "Terry Eagleton", 2013),
                    _book(492, "The Norton Anthology of Theory and Criticism", "Various", 2001),
                    _book(493, "Theory of Literature", "Rene Wellek", 1949),
                    _book(494, "The Mirror and the Lamp", "M.H. Abrams", 1953),
                    _book(495, "The Meaning of Life", "Terry Eagleton", 2007),
                ]
            },
            {
                "number": 10, "name": "Creative Arts",
                "slug": "10-creative-arts",
                "books": [
                    _book(496, "Steal Like an Artist", "Austin Kleon", 2012),
                    _book(497, "Show Your Work", "Austin Kleon", 2014),
                    _book(498, "The War of Art", "Steven Pressfield", 2002),
                    _book(499, "Ways of Seeing", "John Berger", 1972),
                    _book(500, "Art as Experience", "John Dewey", 1934),
                ]
            },
        ]
    })

    return cats

def flatten(cats):
    out = []
    for c in cats:
        for s in c["subcategories"]:
            for b in s["books"]:
                out.append({
                    "cat_number": c["number"],
                    "cat_name": c["name"],
                    "cat_slug": c["slug"],
                    "sub_number": s["number"],
                    "sub_name": s["name"],
                    "sub_slug": s["slug"],
                    "book_number": b["number"],
                    "book_title": b["title"],
                    "book_author": b["author"],
                    "book_year": b["year"],
                    "book_slug": b["slug"],
                    "counterpoint": b.get("counterpoint", False),
                })
    return out

def print_tree(cats):
    for c in cats:
        print(f"\n{c['number']:02d}. {c['name']}")
        print(f"   {c['description']}")
        for s in c["subcategories"]:
            print(f"   {c['number']}.{s['number']:02d} {s['name']}")
            for b in s["books"]:
                cp = " [OPPOSING]" if b.get("counterpoint") else ""
                print(f"       {b['number']:03d}. {b['title']} -- {b['author']} ({b['year']}){cp}")

if __name__ == "__main__":
    cats = build_curriculum()
    if "--tree" in sys.argv:
        print_tree(cats)
    else:
        print(json.dumps(cats, indent=2))
