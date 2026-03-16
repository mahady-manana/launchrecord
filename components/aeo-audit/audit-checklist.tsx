export interface AuditChecklistItem {
  id: string;
  name: string;
  description: string;
}

export const AEO_AUDIT_CHECKLIST: AuditChecklistItem[] = [
  { id: "crawlability", name: "Bot Access", description: "robots.txt and sitemap.xml that guide AI bots to crawl your site" },
  { id: "schema_jsonld", name: "Structured Data", description: "JSON-LD schema markup that helps AI understand your content structure" },
  { id: "answer_blocks", name: "Content Structure", description: "H1/H2/H3 headings, paragraphs, and lists that organize your content" },
  { id: "topic_authority", name: "Topic Coverage", description: "Internal links and content clusters showing expertise in your field" },
  { id: "entities_relations", name: "Brand Entities", description: "Clear mentions of people, organizations, products, and their relationships" },
  { id: "citation_author", name: "Author Credibility", description: "Author bylines and outbound links to authoritative sources" },
  { id: "clarity_structure", name: "Readability", description: "Bullets, tables, and numbered lists with minimal marketing fluff" },
  { id: "freshness", name: "Content Freshness", description: "Published/modified dates showing recently updated information" },
  { id: "external_mentions", name: "Online Presence", description: "Links to Reddit, GitHub, Twitter, and other trusted platforms" },
  { id: "featured_snippet", name: "Answer Quality", description: "Question-style headings and concise definitions for AI snippets" },
  { id: "answer_depth", name: "Content Depth", description: "Word count and contextual links showing comprehensive coverage" },
  { id: "ai_retrieval_vector", name: "AI-Friendly Format", description: "Tables, lists, and Q&A blocks optimized for AI retrieval" },
  { id: "keywords_semantic", name: "Topic Relevance", description: "LSI keywords, synonyms, and semantic variety in language" },
  { id: "tech_perf_cwv", name: "Site Performance", description: "HTTPS, mobile optimization, and Core Web Vitals signals" },
  { id: "multimodal", name: "Visual Content", description: "Images, diagrams, and charts with descriptive alt text" },
  { id: "trust_security", name: "Site Trust", description: "HTTPS encryption and verified site identity via Open Graph/Twitter cards" },
  { id: "uniqueness", name: "Original Content", description: "Original research, statistics, data, and unique insights" },
];
