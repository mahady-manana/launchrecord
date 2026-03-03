export const format_audit_v1 = `{
  "meta": {
    "analysis_version": "SIO_V5",
    "confidence_score": "0-1",
    "analysis_scope": "homepage_only | full_site | homepage_plus_social"
  },

  "aeo_index": {
    "score": "0-100",
    "critique": "<30 words",
    "schema_markup": {
      "present": "boolean",
      "quality_score": "0-100",
      "missing_types": []
    },
    "direct_answer_potential": "<25 words, single sentence>",
    "search_visibility_risk": "low | medium | high",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },

  "positioning_sharpness": {
    "score": "0-100",
    "band": "dominant | strong | blended | weak | ghost",
    "critique": "<40 words",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },

  "clarity_velocity": {
    "score": "0-100",
    "band": "instant | clear | average | confusing | opaque",
    "critique": "<40 words",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },

  "momentum_signal": {
    "score": "0-100",
    "band": "viral | rising | stable | flat | dead",
    "critique": "<40 words",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },

  "founder_proof_vault": {
    "score": "0-100",
    "evidence_types": [
      "testimonials",
      "case_studies",
      "metrics",
      "logos",
      "press",
      "founder_authority"
    ],
    "critique": "<40 words",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },

  "top_competitors": [
    {
      "name": "string",
      "threat_level": "low | medium | high"
    },
    {
      "name": "string",
      "threat_level": "low | medium | high"
    },
    {
      "name": "string",
      "threat_level": "low | medium | high"
    },
    {
      "name": "string",
      "threat_level": "low | medium | high"
    },
    {
      "name": "string",
      "threat_level": "low | medium | high"
    }
  ],

  "overall_assessment": {
    "composite_score": "0-100",
    "category_position": "leader | challenger | replicable | invisible",
    "biggest_leverage_point": "<20 words>",
    "primary_constraint": "authority | positioning | clarity | momentum | proof",
    "survival_probability_12m": "0-100"
  },

  "the_ego_stab": {
    "triggered_by": [
      "low_positioning",
      "weak_proof",
      "clarity_confusion",
      "authority_gap",
      "momentum_flat"
    ],
    "severity": "1-100",
    "brutal_summary": "<20 words>",
    "founder_ego_bait": "<25 words>",
    "cliche_density": "0-100%",
    "founder_bias_risk": "low | medium | high",
    "audit": [
      {
        "action": "<30 words>",
        "priority": "0-100"
      },
      {
        "action": "<30 words>",
        "priority": "0-100"
      }
    ]
  },
  "category_weights": {
    "aeo_index": "0-100",
    "positioning_sharpness": "0-100",
    "clarity_velocity": "0-100",
    "momentum_signal": "0-100",
    "founder_proof_vault": "0-100",
    "total_must_equal": 100,
    "weighting_rationale": "<40 words explaining why these weights fit this domain>"
  }
}`;
