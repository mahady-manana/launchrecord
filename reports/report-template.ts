export const reportTemplate = `{
  intel_metadata: {
    target_id: "string (Product Hunt ID or internal PH_ID)",
    timestamp: "ISO-8601 UTC",
    scan_depth: "Deep_Scan_V2 | Surface | Full_Competitive",
    proxy_route: "Residential_Rotating | DataCenter | VPN",
    source_verification: "boolean (true if verified PH source)",
  },
  sovereign_score: {
    global_rating: "integer (1-100, absolute defensibility score)",
    tier: "UNTOUCHABLE | LETHAL | PLASTIC | ZOMBIE | GHOST",
    percentile: "float (Rank vs. Daily_50 launches)",
    confidence_margin: "float (± error margin based on data freshness)",
    authority:
      "integer (1-100, likelihood of being cited as primary authority by AI or experts)",
  },
  the_ego_stab: {
    brutal_summary: "string (Max 20 words - The 'Cold Truth' for founder ego)",
    commodity_flags: [
      "string (e.g., 'AI-powered', 'Seamless', 'Revolutionize')",
    ],
    differentiator_found: "boolean",
    cliché_density: "percentage",
    founder_bias_risk: "low | medium | high (Is messaging founder-inflated?)",
  },
  positioning_audit: {
    h1_impact: "integer (1-10, punchiness of main headline)",
    category_ownership: {
      claimed_category: "string",
      market_saturation: "percentage (How crowded is the space?)",
      sovereignty_gap:
        "string (Distance to category leader: tech, brand, traction)",
    },
    messaging_clarity: "integer (1-10, how clearly the value is communicated)",
    positioning_risk:
      "low | medium | high (Risk of blending in or being ignored)",
  },
  aeo_intelligence: {
    answer_engine_readiness: "integer (1-10, would AI confidently cite this?)",
    authority_score:
      "integer (1-100, likelihood AI or expert would cite as primary authority)",
    schema_markup: "boolean",
    direct_answer_potential: "string (1 sentence AI snippet for direct answer)",
    search_visibility_risk: "low | medium | high (SEO/structured data gaps)",
  },
  competitive_lens: {
    top_competitor: {
      name: "string",
      sovereign_score: "integer",
      differentiators: ["string"],
    },
    overlap_with_competitors: "percentage",
    competitive_advantage_gap: "string (Where they win/loss vs. leader)",
  },
  strategic_directives: [
    {
      priority: "HIGH | MEDIUM | LOW",
      action: "string (Concrete action for founder/team)",
      expected_impact: "string (Effect on defensibility or traction)",
    },
  ],
  shareable_assets: {
    x_roast_copy: "string (Punchy, <280 chars, founder-friendly roast)",
    founder_ego_bait: "string (Compliment hidden in critique, persuasive tone)",
    social_snippet: "string (Shareable one-liner for external post)",
  },
  audit_notes: {
    confidence_level: "low | medium | high",
    key_unknowns: ["string (data gaps, assumptions, market uncertainty)"],
    follow_up_actions: [
      "string (Recommended further checks, e.g., visit product, interview user)",
    ],
  },
}`;

export const x = {
  intel_metadata: {
    target_id: "string (Product Hunt ID or internal PH_ID)",
    timestamp: "ISO-8601 UTC",
    scan_depth: "Deep_Scan_V2 | Surface | Full_Competitive",
    proxy_route: "Residential_Rotating | DataCenter | VPN",
    source_verification: "boolean (true if verified PH source)",
  },
  sovereign_score: {
    global_rating: "integer (1-100, absolute defensibility score)",
    tier: "UNTOUCHABLE | LETHAL | PLASTIC | ZOMBIE | GHOST",
    percentile: "float (Rank vs. Daily_50 launches)",
    confidence_margin: "float (± error margin based on data freshness)",
    authority:
      "integer (1-100, likelihood of being cited as primary authority by AI or experts)",
  },
  the_ego_stab: {
    brutal_summary: "string (Max 20 words - The 'Cold Truth' for founder ego)",
    commodity_flags: [
      "string (e.g., 'AI-powered', 'Seamless', 'Revolutionize')",
    ],
    differentiator_found: "boolean",
    cliché_density: "percentage",
    founder_bias_risk: "low | medium | high (Is messaging founder-inflated?)",
  },
  positioning_audit: {
    h1_impact: "integer (1-10, punchiness of main headline)",
    category_ownership: {
      claimed_category: "string",
      market_saturation: "percentage (How crowded is the space?)",
      sovereignty_gap:
        "string (Distance to category leader: tech, brand, traction)",
    },
    messaging_clarity: "integer (1-10, how clearly the value is communicated)",
    positioning_risk:
      "low | medium | high (Risk of blending in or being ignored)",
  },
  aeo_intelligence: {
    answer_engine_readiness: "integer (1-10, would AI confidently cite this?)",
    authority_score:
      "integer (1-100, likelihood AI or expert would cite as primary authority)",
    schema_markup: "boolean",
    direct_answer_potential: "string (1 sentence AI snippet for direct answer)",
    search_visibility_risk: "low | medium | high (SEO/structured data gaps)",
  },
  competitive_lens: {
    top_competitor: {
      name: "string",
      sovereign_score: "integer",
      differentiators: ["string"],
    },
    overlap_with_competitors: "percentage",
    competitive_advantage_gap: "string (Where they win/loss vs. leader)",
  },
  strategic_directives: [
    {
      priority: "HIGH | MEDIUM | LOW",
      action: "string (Concrete action for founder/team)",
      expected_impact: "string (Effect on defensibility or traction)",
    },
  ],
  shareable_assets: {
    x_roast_copy: "string (Punchy, <280 chars, founder-friendly roast)",
    founder_ego_bait: "string (Compliment hidden in critique, persuasive tone)",
    social_snippet: "string (Shareable one-liner for external post)",
  },
  audit_notes: {
    confidence_level: "low | medium | high",
    key_unknowns: ["string (data gaps, assumptions, market uncertainty)"],
    follow_up_actions: [
      "string (Recommended further checks, e.g., visit product, interview user)",
    ],
  },
};
