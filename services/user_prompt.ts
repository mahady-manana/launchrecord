export interface UserPromptProduct {
  name: string;
  website: string;
  founder?: string;
  revenueStage?: string;
  tagline?: string;
  description: string;
  websiteContent: string;
}
export const user_prompt = ({
  description,
  name,
  website,
  founder,
  revenueStage,
  tagline,
  websiteContent,
}: UserPromptProduct) => `Analyze this SaaS product using Our Sovereign Defensibility Framework SIO V5 - SIDLE :

FOUNDER SELF-ASSESSMENT SURVEY:
- Name: ${name}
- Website: ${website}
- Product tagline : ${tagline}
- Product Description : ${description}
- Founder: ${founder}
- Revenue Stage: ${revenueStage}


CURRENT WEBSITE CONTENT (COMPRESSED CONTENT):

This content is generated using Axios.get and Cheerio. This content is the current copntent of the website
- Metadata
- Schema JSON-LD
- H1 & content


${websiteContent}

Analyze their positioning, AEO visibility, and competitive moat. Be specific and data-driven. Don't give an emotional reports.`;
