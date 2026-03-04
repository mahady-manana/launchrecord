import { format_audit_v1 } from "./format_v1";

export const json_format_audit = `

You will receive a single product input (website, Product Hunt, or metadata).
You must only return a JSON object following the prescribed format.

Key Rules:

1. Do not add or omit fields. Every field must exist and follow the type and constraints.
2. Scores are numeric (0-100) and must match the defined semantics.
3. Bands, tiers, and risk levels must use exactly the allowed string values.
4. Arrays must contain objects or strings exactly as specified; no extra nesting or explanations.
5. Text fields must respect length constraints (e.g., <20 or <30 words).
6. the_ego_stab must be generated based on your audit, not prefilled.
7. audit lists are actionable follow-ups, not commentary.
8. category_weights dictate how each main audit category contributes to the overall product score:
    - These weights are not fixed; they should reflect the product's domain, niche, and audit priorities.
    - Ensure the weights sum to 100.
    - Justify the weights briefly in the field weighting_rationale based on your audit findings.
9. The AI must not hallucinate product metrics; infer only from the provided input (site content, PH metadata, or other explicit data).
10. Return strictly valid JSON, ready to be parsed automatically — no explanations, no extra output, no text outside the JSON object.
11. Overall Assessment: composite_score is the average between the 5 categories: AEO, Positioning, Clarity, Momentum and Proof Vault

Here is the JSON format you must follow:

${format_audit_v1}

Follow this format strictly. Your output will be consumed by internal systems; any deviation breaks downstream calculations.
`;
