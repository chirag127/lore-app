"""
KnowledgeAtlas 10-Category Knowledge Curriculum
================================================
Canonical taxonomy: 10 categories, numbered subcategories,
numbered books. Every directory and file is numbered for
alphabetical sorting in both filesystem and GitHub.

Usage:
    python scripts/01_curriculum.py          # prints JSON
    python scripts/01_curriculum.py --tree   # prints tree
"""
from __future__ import annotations
import json, sys
from dataclasses import dataclass, field, asdict
from typing import List

REQUIRED_FILES = [
    "index.mdx",
    "01-content.mdx",
    "02-analysis.mdx",
    "03-narration.mdx",
    "04-problems.mdx",
    "meta.json",
]

# ─── DATA MODEL ──────────────────────────────────────────────────────

@dataclass
class Book:
    number: int
    title: str
    author: str
    year: int
    slug: str
    counterpoint: bool = False
    isbn13: str = ""
    pages: int = 0

@dataclass
class Subcategory:
    number: int
    name: str
    slug: str
    books: List[Book] = field(default_factory=list)

@dataclass
class Category:
    number: int
    name: str
    slug: str
    description: str
    subcategories: List[Subcategory] = field(default_factory=list)


def _s(text: str) -> str:
    """slugify"""
    return text.lower().replace(" ", "-").replace(",", "").replace(":", "").replace("'", "").replace(".", "").replace('"', "").replace("&", "and").replace("/", "-").replace("(", "").replace(")", "")

def _book(n: int, title: str, author: str, year: int, counterpoint=False) -> Book:
    slug = _s(f"{_s(title)}-{_s(author)}")
    return Book(number=n, title=title, author=author, year=year, slug=slug, counterpoint=counterpoint)

def _sub(num: int, name: str, books: List[Book]) -> Subcategory:
    return Subcategory(number=num, name=name, slug=_s(name), books=books)

# ─── THE CURRICULUM ──────────────────────────────────────────────────

def build_curriculum() -> List[Category]:
    cats = []

    # ═════════════════════════════════════════════════════════════════
    # 1. LEARNING HOW TO LEARN
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=1,
        name="Learning How to Learn",
        slug="01-learning-how-to-learn",
        description="Meta-learning, study methods, deep work, and skill acquisition. Read this category first.",
        subcategories=[
            _sub(1, "Learning Foundations", [
                _book(1, "How to Read a Book", "Mortimer J. Adler", 1940),
                _book(2, "The Core", "Barbara Oakley", 2023),
                _book(3, "A Mind for Numbers", "Barbara Oakley", 2014),
            ]),
            _sub(2, "Study Methods and Memory", [
                _book(4, "Make It Stick", "Peter C. Brown", 2014),
                _book(5, "Moonwalking with Einstein", "Joshua Foer", 2011),
                _book(6, "How to Take Smart Notes", "Sonke Ahrens", 2017),
            ]),
            _sub(3, "Deep Work and Focus", [
                _book(7, "Deep Work", "Cal Newport", 2016),
                _book(8, "Digital Minimalism", "Cal Newport", 2019),
                _book(9, "Indistractable", "Nir Eyal", 2019),
            ]),
            _sub(4, "Skill Acquisition and Mastery", [
                _book(10, "Ultralearning", "Scott Young", 2019),
                _book(11, "Peak", "Anders Ericsson", 2016),
                _book(12, "The Art of Learning", "Josh Waitzkin", 2007),
                _book(13, "Range", "David Epstein", 2019, counterpoint=True),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 2. THINKING AND DECISION MAKING
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=2,
        name="Thinking and Decision Making",
        slug="02-thinking-and-decision-making",
        description="Mental models, cognitive biases, probability, and rationality.",
        subcategories=[
            _sub(1, "Cognitive Biases and Rationality", [
                _book(14, "Thinking, Fast and Slow", "Daniel Kahneman", 2011),
                _book(15, "Predictably Irrational", "Dan Ariely", 2008),
                _book(16, "Mistakes Were Made But Not By Me", "Carol Tavris", 2007),
            ]),
            _sub(2, "Mental Models and Multidisciplinary Thinking", [
                _book(17, "Poor Charlie's Almanack", "Charlie Munger", 2005),
                _book(18, "The Great Mental Models Vol. 1", "Shane Parrish", 2019),
                _book(19, "The Great Mental Models Vol. 2", "Shane Parrish", 2020),
                _book(20, "Algorithms to Live By", "Brian Christian", 2016),
            ]),
            _sub(3, "Forecasting and Judgment", [
                _book(21, "Superforecasting", "Philip Tetlock", 2015),
                _book(22, "The Scout Mindset", "Julia Galef", 2021),
                _book(23, "Thinking in Bets", "Annie Duke", 2018),
            ]),
            _sub(4, "Risk, Probability, and Uncertainty", [
                _book(24, "Fooled by Randomness", "Nassim Taleb", 2001),
                _book(25, "The Black Swan", "Nassim Taleb", 2007),
                _book(26, "Antifragile", "Nassim Taleb", 2012, counterpoint=True),
                _book(27, "Skin in the Game", "Nassim Taleb", 2018),
                _book(28, "The Drunkard's Walk", "Leonard Mlodinow", 2008),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 3. PSYCHOLOGY AND HUMAN NATURE
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=3,
        name="Psychology and Human Nature",
        slug="03-psychology-and-human-nature",
        description="How humans think, feel, and behave — individually and in groups.",
        subcategories=[
            _sub(1, "Social Psychology and Influence", [
                _book(29, "Influence", "Robert Cialdini", 1984),
                _book(30, "Pre-Suasion", "Robert Cialdini", 2016),
                _book(31, "The Righteous Mind", "Jonathan Haidt", 2012),
                _book(32, "Mistakes Were Made But Not By Me", "Carol Tavris", 2007),
            ]),
            _sub(2, "Emotion, Motivation, and Drive", [
                _book(33, "Drive", "Daniel Pink", 2009),
                _book(34, "Grit", "Angela Duckworth", 2016),
                _book(35, "Flow", "Mihaly Csikszentmihalyi", 1990),
                _book(36, "Emotional Intelligence", "Daniel Goleman", 1995),
            ]),
            _sub(3, "Personality and Human Nature", [
                _book(37, "The Laws of Human Nature", "Robert Greene", 2018),
                _book(38, "Misbehaving", "Richard Thaler", 2015),
                _book(39, "Nudge", "Richard Thaler", 2008),
                _book(40, "The Happiness Hypothesis", "Jonathan Haidt", 2006),
            ]),
            _sub(4, "Existential and Positive Psychology", [
                _book(41, "Man's Search for Meaning", "Viktor Frankl", 1946),
                _book(42, "The Denial of Death", "Ernest Becker", 1973, counterpoint=True),
                _book(43, "Lost Connections", "Johann Hari", 2018, counterpoint=True),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 4. COMMUNICATION AND INFLUENCE
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=4,
        name="Communication and Influence",
        slug="04-communication-and-influence",
        description="Writing, speaking, persuasion, negotiation, and storytelling.",
        subcategories=[
            _sub(1, "Interpersonal Communication", [
                _book(44, "How to Win Friends and Influence People", "Dale Carnegie", 1936),
                _book(45, "Never Split the Difference", "Chris Voss", 2016),
                _book(46, "Crucial Conversations", "Patterson Grenny", 2011),
                _book(47, "The Charisma Myth", "Olivia Fox Cabane", 2012),
            ]),
            _sub(2, "Public Speaking and Presentation", [
                _book(48, "Talk Like TED", "Carmine Gallo", 2014),
                _book(49, "Presentation Zen", "Garr Reynolds", 2008),
                _book(50, "Resonate", "Nancy Duarte", 2010),
            ]),
            _sub(3, "Writing and Storytelling", [
                _book(51, "Made to Stick", "Chip Heath", 2007),
                _book(52, "On Writing Well", "William Zinsser", 1976),
                _book(53, "Everybody Writes", "Ann Handley", 2014),
                _book(54, "Storyworthy", "Matthew Dicks", 2018),
                _book(55, "The Pyramid Principle", "Barbara Minto", 1987),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 5. PERSONAL FINANCE AND INVESTING
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=5,
        name="Personal Finance and Investing",
        slug="05-personal-finance-and-investing",
        description="Wealth building, value investing, index investing, and money psychology.",
        subcategories=[
            _sub(1, "Money Psychology and Wealth Building", [
                _book(56, "The Psychology of Money", "Morgan Housel", 2020),
                _book(57, "The Millionaire Next Door", "Thomas Stanley", 1996),
                _book(58, "The Richest Man in Babylon", "George Clason", 1926),
                _book(59, "I Will Teach You to Be Rich", "Ramit Sethi", 2009),
                _book(60, "Your Money or Your Life", "Vicki Robin", 2008),
            ]),
            _sub(2, "Value Investing", [
                _book(61, "The Intelligent Investor", "Benjamin Graham", 1949),
                _book(62, "Security Analysis", "Benjamin Graham", 1934),
                _book(63, "Common Stocks and Uncommon Profits", "Philip Fisher", 1958),
                _book(64, "One Up On Wall Street", "Peter Lynch", 1989),
                _book(65, "The Most Important Thing", "Howard Marks", 2011),
            ]),
            _sub(3, "Index Investing and Passive Strategies", [
                _book(66, "A Random Walk Down Wall Street", "Burton Malkiel", 1973),
                _book(67, "The Little Book of Common Sense Investing", "John Bogle", 2007),
                _book(68, "Stocks for the Long Run", "Jeremy Siegel", 1994),
                _book(69, "The Investor's Manifesto", "William Bernstein", 2010),
            ]),
            _sub(4, "Advanced and Contrarian Investing", [
                _book(70, "100 Baggers", "Christopher Mayer", 2015),
                _book(71, "Coffee Can Investing", "Saurabh Mukherjea", 2018),
                _book(72, "The Dhando Investor", "Mohnish Pabrai", 2007),
                _book(73, "Die With Zero", "Bill Perkins", 2020, counterpoint=True),
                _book(74, "The Warren Buffett Way", "Robert Hagstrom", 1994),
            ]),
            _sub(5, "Alternative Investments and Risk", [
                _book(75, "The Bitcoin Standard", "Saifedean Ammous", 2018, counterpoint=True),
                _book(76, "Flash Boys", "Michael Lewis", 2014),
                _book(77, "When Genius Failed", "Roger Lowenstein", 2000),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 6. BUSINESS AND LEADERSHIP
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=6,
        name="Business and Leadership",
        slug="06-business-and-leadership",
        description="Entrepreneurship, strategy, management, leadership, and operations.",
        subcategories=[
            _sub(1, "Entrepreneurship and Startups", [
                _book(78, "Zero to One", "Peter Thiel", 2014),
                _book(79, "The Lean Startup", "Eric Ries", 2011),
                _book(80, "Rework", "Jason Fried", 2010),
                _book(81, "Company of One", "Paul Jarvis", 2019),
                _book(82, "The Mom Test", "Rob Fitzpatrick", 2013),
                _book(83, "The Hard Thing About Hard Things", "Ben Horowitz", 2014),
            ]),
            _sub(2, "Strategy and Innovation", [
                _book(84, "Good Strategy Bad Strategy", "Richard Rumelt", 2011),
                _book(85, "Blue Ocean Strategy", "Chan Kim", 2005),
                _book(86, "The Innovator's Dilemma", "Clayton Christensen", 1997),
                _book(87, "Crossing the Chasm", "Geoffrey Moore", 1991),
                _book(88, "Positioning", "Al Ries", 1981),
            ]),
            _sub(3, "Leadership and Management", [
                _book(89, "High Output Management", "Andy Grove", 1995),
                _book(90, "Extreme Ownership", "Jocko Willink", 2015),
                _book(91, "Leaders Eat Last", "Simon Sinek", 2014),
                _book(92, "Radical Candor", "Kim Scott", 2017),
                _book(93, "The Effective Executive", "Peter Drucker", 1967),
            ]),
            _sub(4, "Productivity and Operations", [
                _book(94, "Atomic Habits", "James Clear", 2018),
                _book(95, "Getting Things Done", "David Allen", 2001),
                _book(96, "Essentialism", "Greg McKeown", 2014),
                _book(97, "Four Thousand Weeks", "Oliver Burkeman", 2021, counterpoint=True),
                _book(98, "The Checklist Manifesto", "Atul Gawande", 2009),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 7. SOFTWARE ENGINEERING AND COMPUTER SCIENCE
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=7,
        name="Software Engineering and Computer Science",
        slug="07-software-engineering-and-computer-science",
        description="Code craft, architecture, algorithms, systems, and networking.",
        subcategories=[
            _sub(1, "Code Craft and Quality", [
                _book(99, "Clean Code", "Robert Martin", 2008),
                _book(100, "The Pragmatic Programmer", "Andrew Hunt", 1999),
                _book(101, "Code Complete", "Steve McConnell", 1993),
                _book(102, "Refactoring", "Martin Fowler", 1999),
                _book(103, "Working Effectively with Legacy Code", "Michael Feathers", 2004),
            ]),
            _sub(2, "Software Architecture and Design", [
                _book(104, "Clean Architecture", "Robert Martin", 2017),
                _book(105, "A Philosophy of Software Design", "John Ousterhout", 2018),
                _book(106, "Domain-Driven Design", "Eric Evans", 2003),
                _book(107, "Fundamentals of Software Architecture", "Mark Richards", 2020),
                _book(108, "Software Architecture in Practice", "Len Bass", 2012),
            ]),
            _sub(3, "Algorithms and Data Structures", [
                _book(109, "Grokking Algorithms", "Aditya Bhargava", 2016),
                _book(110, "Introduction to Algorithms", "Thomas Cormen", 2022),
                _book(111, "The Algorithm Design Manual", "Steven Skiena", 2008),
                _book(112, "Programming Pearls", "Jon Bentley", 1986),
            ]),
            _sub(4, "Systems and Infrastructure", [
                _book(113, "Designing Data-Intensive Applications", "Martin Kleppmann", 2017),
                _book(114, "Computer Systems: A Programmer's Perspective", "Randal Bryant", 2015),
                _book(115, "Operating Systems: Three Easy Pieces", "Remzi Arpaci-Dusseau", 2014),
                _book(116, "Modern Operating Systems", "Andrew Tanenbaum", 2014),
            ]),
            _sub(5, "Networking and Distributed Systems", [
                _book(117, "Computer Networking: A Top-Down Approach", "James Kurose", 2021),
                _book(118, "TCP/IP Illustrated Vol. 1", "Kevin Fall", 2011),
                _book(119, "Designing Distributed Systems", "Brendan Burns", 2018),
                _book(120, "Building Microservices", "Sam Newman", 2021),
                _book(121, "Site Reliability Engineering", "Betsy Beyer", 2016),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 8. AI, DATA, AND PYTHON
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=8,
        name="AI, Data, and Python",
        slug="08-ai-data-and-python",
        description="Machine learning, deep learning, NLP, data science, and Python mastery.",
        subcategories=[
            _sub(1, "Python Programming", [
                _book(122, "Fluent Python", "Luciano Ramalho", 2015),
                _book(123, "Effective Python", "Brett Slatkin", 2019),
                _book(124, "Python Cookbook", "David Beazley", 2013),
                _book(125, "Architecture Patterns with Python", "Harry Percival", 2019),
            ]),
            _sub(2, "Machine Learning Foundations", [
                _book(126, "Hands-On Machine Learning", "Aurélien Géron", 2019),
                _book(127, "Artificial Intelligence: A Modern Approach", "Stuart Russell", 2020),
                _book(128, "Pattern Recognition and Machine Learning", "Christopher Bishop", 2006),
                _book(129, "Mathematics for Machine Learning", "Marc Deisenroth", 2020),
                _book(130, "Practical Statistics for Data Scientists", "Peter Bruce", 2017),
            ]),
            _sub(3, "Deep Learning and Neural Networks", [
                _book(131, "Deep Learning", "Ian Goodfellow", 2016),
                _book(132, "Deep Learning with Python", "François Chollet", 2021),
                _book(133, "Build a Large Language Model From Scratch", "Sebastian Raschka", 2024),
            ]),
            _sub(4, "NLP and Transformers", [
                _book(134, "Natural Language Processing with Transformers", "Lewis Tunstall", 2022),
                _book(135, "Speech and Language Processing", "Daniel Jurafsky", 2023),
            ]),
            _sub(5, "MLOps and Production AI", [
                _book(136, "Designing Machine Learning Systems", "Chip Huyen", 2022),
                _book(137, "Machine Learning Engineering", "Andrey Burkov", 2020),
                _book(138, "AI Safety and Alignment", "Various", 2024),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 9. ECONOMICS AND HISTORY
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=9,
        name="Economics and History",
        slug="09-economics-and-history",
        description="Economic theory, world history, political economy, and big history.",
        subcategories=[
            _sub(1, "Microeconomics and Foundations", [
                _book(139, "Basic Economics", "Thomas Sowell", 2000),
                _book(140, "Economics in One Lesson", "Henry Hazlitt", 1946),
                _book(141, "The Undercover Economist", "Tim Harford", 2005),
                _book(142, "The Wealth of Nations", "Adam Smith", 1776),
            ]),
            _sub(2, "Macroeconomics and Political Economy", [
                _book(143, "Capitalism and Freedom", "Milton Friedman", 1962),
                _book(144, "The Road to Serfdom", "Friedrich Hayek", 1944),
                _book(145, "Why Nations Fail", "Daron Acemoglu", 2012),
                _book(146, "The Sovereign Individual", "James Dale Davidson", 1997),
            ]),
            _sub(3, "Behavioral and Development Economics", [
                _book(147, "Freakonomics", "Steven Levitt", 2005),
                _book(148, "Thinking, Fast and Slow", "Daniel Kahneman", 2011),
                _book(149, "Development as Freedom", "Amartya Sen", 1999),
            ]),
            _sub(4, "Big History and Civilizations", [
                _book(150, "Sapiens", "Yuval Noah Harari", 2011),
                _book(151, "Homo Deus", "Yuval Noah Harari", 2016),
                _book(152, "Guns, Germs, and Steel", "Jared Diamond", 1997),
                _book(153, "The Lessons of History", "Will Durant", 1968),
                _book(154, "The Silk Roads", "Peter Frankopan", 2015),
            ]),
            _sub(5, "Modern and Regional History", [
                _book(155, "Destiny Disrupted", "Tamim Ansary", 2009),
                _book(156, "Postwar", "Tony Judt", 2005),
                _book(157, "The Rise and Fall of the Third Reich", "William Shirer", 1960),
                _book(158, "A People's History of the United States", "Howard Zinn", 1980),
            ]),
        ]
    ))

    # ═════════════════════════════════════════════════════════════════
    # 10. SCIENCE, PHILOSOPHY, AND CREATIVITY
    # ═════════════════════════════════════════════════════════════════
    cats.append(Category(
        number=10,
        name="Science, Philosophy, and Creativity",
        slug="10-science-philosophy-and-creativity",
        description="Natural science, philosophy of mind, Eastern wisdom, and creative thinking.",
        subcategories=[
            _sub(1, "Natural Science", [
                _book(159, "A Short History of Nearly Everything", "Bill Bryson", 2003),
                _book(160, "The Selfish Gene", "Richard Dawkins", 1976),
                _book(161, "The Gene", "Siddhartha Mukherjee", 2016),
                _book(162, "Why We Sleep", "Matthew Walker", 2017),
                _book(163, "Cosmos", "Carl Sagan", 1980),
            ]),
            _sub(2, "Western Philosophy", [
                _book(164, "The Republic", "Plato", -375),
                _book(165, "Meditations", "Marcus Aurelius", 180),
                _book(166, "Letters from a Stoic", "Seneca", 65),
                _book(167, "Beyond Good and Evil", "Friedrich Nietzsche", 1886),
                _book(168, "The Problems of Philosophy", "Bertrand Russell", 1912),
            ]),
            _sub(3, "Eastern Philosophy and Spirituality", [
                _book(169, "Bhagavad Gita", "Tradition", -300),
                _book(170, "Tao Te Ching", "Lao Tzu", -500),
                _book(171, "The Art of War", "Sun Tzu", -500),
                _book(172, "Dhammapada", "Tradition", -250),
                _book(173, "The Way of Zen", "Alan Watts", 1957),
            ]),
            _sub(4, "Creativity and Art", [
                _book(174, "Steal Like an Artist", "Austin Kleon", 2012),
                _book(175, "Show Your Work", "Austin Kleon", 2014),
                _book(176, "Creative Confidence", "Tom Kelley", 2013),
                _book(177, "The War of Art", "Steven Pressfield", 2002),
                _book(178, "Originals", "Adam Grant", 2016),
            ]),
            _sub(5, "Science and Society", [
                _book(179, "The Structure of Scientific Revolutions", "Thomas Kuhn", 1962),
                _book(180, "The Emperor of All Maladies", "Siddhartha Mukherjee", 2010),
                _book(181, "Silent Spring", "Rachel Carson", 1962),
                _book(182, "The Death of Nature", "Carolyn Merchant", 1980, counterpoint=True),
            ]),
        ]
    ))

    return cats


def flatten(cats: list[Category]) -> list[dict]:
    """Flatten to a list of {cat, sub, book} dicts for migration."""
    out = []
    for c in cats:
        for s in c.subcategories:
            for b in s.books:
                out.append({
                    "cat_number": c.number,
                    "cat_name": c.name,
                    "cat_slug": c.slug,
                    "sub_number": s.number,
                    "sub_name": s.name,
                    "sub_slug": s.slug,
                    "book_number": b.number,
                    "book_title": b.title,
                    "book_author": b.author,
                    "book_year": b.year,
                    "book_slug": b.slug,
                    "counterpoint": b.counterpoint,
                })
    return out


def print_tree(cats: list[Category]):
    for c in cats:
        print(f"\n{c.number}. {c.name}")
        print(f"   {c.description}")
        for s in c.subcategories:
            print(f"   {c.number}.{s.number} {s.name}")
            for b in s.books:
                cp = " [CONTRARIAN]" if b.counterpoint else ""
                print(f"       {b.number:3d}. {b.title} -- {b.author} ({b.year}){cp}")


if __name__ == "__main__":
    cats = build_curriculum()
    if "--tree" in sys.argv:
        print_tree(cats)
    else:
        print(json.dumps([asdict(c) for c in cats], indent=2))
