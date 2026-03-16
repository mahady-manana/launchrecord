export const AEO_CHECKLIST = [
  {
    id: "crawlability",
    name: "Crawlability/AI bot access",
    description:
      "Verify robots.txt, meta robots, and sitemap so AI bots can fetch key content.",
    weight: 10,
  },
  {
    id: "schema_jsonld",
    name: "Structured data/schema",
    description:
      "Validate JSON-LD (Website, FAQPage, HowTo, Article, etc) for correctness and coverage.",
    weight: 15,
  },
  {
    id: "answer_blocks",
    name: "Answer blocks",
    description:
      "Ensure headings, paragraphs, and lists surface direct, concise answers.",
    weight: 10,
  },
  {
    id: "topic_authority",
    name: "Topical authority/cluster",
    description:
      "Confirm topic clusters, internal links, and semantic structure reinforce authority.",
    weight: 10,
  },
  {
    id: "entities_relations",
    name: "Entities/relations",
    description:
      "Identify core entities (people, orgs, products, tech) and their relationships.",
    weight: 5,
  },
  {
    id: "citation_author",
    name: "Citations/author",
    description:
      "Provide author info, references, and outbound links to credible sources.",
    weight: 10,
  },
  {
    id: "clarity_structure",
    name: "Clarity/structure",
    description:
      "Use bullets, tables, and numbered lists; minimize marketing fluff.",
    weight: 5,
  },
  {
    id: "freshness",
    name: "Freshness",
    description:
      "Check last-modified signals, update cadence, and recent examples.",
    weight: 5,
  },
  {
    id: "external_mentions",
    name: "External mentions",
    description:
      "Look for third-party mentions on Reddit, GitHub, blogs, and papers.",
    weight: 5,
  },
  {
    id: "featured_snippet",
    name: "Featured snippet fit",
    description:
      "Include short definitions, steps, and FAQs suitable for snippets.",
    weight: 5,
  },
  {
    id: "answer_depth",
    name: "Answer depth",
    description: "Add rationale and context plus links to related topics.",
    weight: 5,
  },
  {
    id: "ai_retrieval_vector",
    name: "AI retrieval/vector",
    description:
      "Keep content structured with short paragraphs, tables, and Q&A blocks.",
    weight: 5,
  },
  {
    id: "keywords_semantic",
    name: "Keywords/semantic",
    description: "Cover LSI keywords, synonyms, and NLP-relevant entities.",
    weight: 3,
  },
  {
    id: "tech_perf_cwv",
    name: "Tech perf/CWV",
    description: "Assess Core Web Vitals, speed, and mobile UX.",
    weight: 3,
  },
  {
    id: "multimodal",
    name: "Multimodal (optional)",
    description: "Add images, diagrams, and charts with descriptive alt text.",
    weight: 2,
  },
  {
    id: "trust_security",
    name: "Trust/security",
    description: "Verify HTTPS, privacy policy, and cookie compliance.",
    weight: 2,
  },
  {
    id: "uniqueness",
    name: "Uniqueness",
    description:
      "Check for originality, plagiarism risk, and unique data/research.",
    weight: 5,
  },
];

export const aeo_checklist = `

This a SIDLE (Sovereign Intelligence & Defensibility Ledger) System used to measure AEO Presence for startup's website.
This is a technical and content related scoring (100/100)
It doesn't includes Brand recognition, Authors authorities 

DONT FORGET TO INCLUDE CHECKLIST ID IN aeo_index.audit: [{checklistId: 'id'}] if not completed or need improvement

HERE ARE THE AEO CHECKLIST:

${JSON.stringify(AEO_CHECKLIST, null, 2)}


`;
