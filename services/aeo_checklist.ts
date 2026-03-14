export const aeo_checklist = `

This a SIDLE (Sovereign Intelligence & Defensibility Ledger) System used to measure AEO Presence for startup's website.
This is a technical and content related scoring (100/100)
It doesn't includes Brand recognition, Authors authorities 

id: crawlability
Name: Crawlability/AI bot access
Desc: Verify robots.txt, meta robots, and sitemap so AI bots can fetch key content.
Weight: 10

id: schema_jsonld
Name: Structured data/schema
Desc: Validate JSON-LD (FAQPage, HowTo, Article, SoftwareApplication) for correctness and coverage.
Weight: 15

id: answer_blocks
Name: Answer blocks
Desc: Ensure headings, paragraphs, and lists surface direct, concise answers.
Weight: 10

id: topic_authority
Name: Topical authority/cluster
Desc: Confirm topic clusters, internal links, and semantic structure reinforce authority.
Weight: 10

id: entities_relations
Name: Entities/relations
Desc: Identify core entities (people, orgs, products, tech) and their relationships.
Weight: 5

id: citation_author
Name: Citations/author
Desc: Provide author info, references, and outbound links to credible sources.
Weight: 10

id: clarity_structure
Name: Clarity/structure
Desc: Use bullets, tables, and numbered lists; minimize marketing fluff.
Weight: 5

id: freshness
Name: Freshness
Desc: Check last-modified signals, update cadence, and recent examples.
Weight: 5

id: external_mentions
Name: External mentions
Desc: Look for third-party mentions on Reddit, GitHub, blogs, and papers.
Weight: 5

id: featured_snippet
Name: Featured snippet fit
Desc: Include short definitions, steps, and FAQs suitable for snippets.
Weight: 5

id: answer_depth
Name: Answer depth
Desc: Add rationale and context plus links to related topics.
Weight: 5

id: ai_retrieval_vector
Name: AI retrieval/vector
Desc: Keep content structured with short paragraphs, tables, and Q&A blocks.
Weight: 5

id: keywords_semantic
Name: Keywords/semantic
Desc: Cover LSI keywords, synonyms, and NLP-relevant entities.
Weight: 3

id: tech_perf_cwv
Name: Tech perf/CWV
Desc: Assess Core Web Vitals, speed, and mobile UX.
Weight: 3

id: multimodal
Name: Multimodal (opt)
Desc: Add images, diagrams, and charts with descriptive alt text.
Weight: 2

id: trust_security
Name: Trust/security
Desc: Verify HTTPS, privacy policy, and cookie compliance.
Weight: 2

id: uniqueness
Name: Uniqueness
Desc: Check for originality, plagiarism risk, and unique data/research.
Weight: 5

`;
