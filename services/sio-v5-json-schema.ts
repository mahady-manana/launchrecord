export const sioV5JsonSchema = {
  type: "object",
  properties: {
    websiteSummary: {
      type: "object",
      properties: {
        summary: { type: "string" },
        summaryComment: { type: "string" },
        problems: {
          type: "object",
          properties: {
            currents: { type: "array", items: { type: "string" } },
            comments: { type: "array", items: { type: "string" } },
          },
          required: ["currents", "comments"],
        },
        outcomes: {
          type: "object",
          properties: {
            currents: { type: "array", items: { type: "string" } },
            comments: { type: "array", items: { type: "string" } },
          },
          required: ["currents", "comments"],
        },
        solutions: {
          type: "object",
          properties: {
            currents: { type: "array", items: { type: "string" } },
            comments: { type: "array", items: { type: "string" } },
          },
          required: ["currents", "comments"],
        },
        features: {
          type: "object",
          properties: {
            currents: { type: "array", items: { type: "string" } },
            comments: { type: "array", items: { type: "string" } },
          },
          required: ["currents", "comments"],
        },
        isPositioningClear: { type: "boolean" },
        isMessagingClear: { type: "boolean" },
        areUsersLeftGuessing: { type: "boolean" },
      },
      required: [
        "summary",
        "problems",
        "outcomes",
        "solutions",
        "features",
        "isPositioningClear",
        "isMessagingClear",
        "areUsersLeftGuessing",
      ],
    },
    firstImpression: {
      type: "object",
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        statement: { type: "string" },
        overallComment: { type: "string" },
        headline: {
          type: "object",
          properties: {
            current: { type: "string" },
            comment: { type: "string" },
            suggested: { type: "string" },
          },
          required: ["current", "comment", "suggested"],
        },
        subheadline: {
          type: "object",
          properties: {
            current: { type: "string" },
            comment: { type: "string" },
            suggested: { type: "string" },
          },
          required: ["current", "comment", "suggested"],
        },
        cta: {
          type: "object",
          properties: {
            current: { type: "string" },
            comment: { type: "string" },
            suggested: { type: "string" },
          },
          required: ["current", "comment", "suggested"],
        },
      },
      required: ["score", "statement", "overallComment", "headline", "subheadline", "cta"],
    },
    positioning: {
      type: "object",
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        statement: { type: "string" },
        summary: {
          type: "object",
          properties: {
            current: { type: "string" },
            comments: { type: "array", items: { type: "string" } },
            suggested: { type: "string" },
          },
          required: ["current", "comments", "suggested"],
        },
        subMetrics: {
          type: "object",
          properties: {
            categoryOwnership: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
            uniqueValueProp: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
            competitiveDiff: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
            targetAudience: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
            problemSolutionFit: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
            messagingConsistency: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
              },
              required: ["name", "score", "current", "comments", "suggested"],
            },
          },
          required: [
            "categoryOwnership",
            "uniqueValueProp",
            "competitiveDiff",
            "targetAudience",
            "problemSolutionFit",
            "messagingConsistency",
          ],
        },
      },
      required: ["score", "statement", "summary", "subMetrics"],
    },
    clarity: {
      type: "object",
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        statement: { type: "string" },
        summary: {
          type: "object",
          properties: {
            current: { type: "string" },
            comments: { type: "array", items: { type: "string" } },
            suggested: { type: "string" },
          },
          required: ["current", "comments", "suggested"],
        },
        unclearSentences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              issue: { type: "string" },
              fix: { type: "string" },
            },
            required: ["text", "issue", "fix"],
          },
        },
        subMetrics: {
          type: "object",
          properties: {
            headlineClarity: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
            valueProposition: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
            featureBenefitMapping: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
            visualHierarchy: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
            ctaClarity: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
            proofPlacement: {
              type: "object",
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                current: { type: "string" },
                comments: { type: "array", items: { type: "string" } },
                suggested: { type: "string" },
                unclearTexts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["text", "issue", "fix"],
                  },
                },
              },
              required: ["name", "score", "current", "comments", "suggested", "unclearTexts"],
            },
          },
          required: [
            "headlineClarity",
            "valueProposition",
            "featureBenefitMapping",
            "visualHierarchy",
            "ctaClarity",
            "proofPlacement",
          ],
        },
      },
      required: ["score", "statement", "summary", "unclearSentences", "subMetrics"],
    },
    aeo: {
      type: "object",
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        statement: { type: "string" },
        aiPresence: {
          type: "object",
          properties: {
            isPresent: { type: "boolean" },
            engines: { type: "array", items: { type: "string" } },
            comment: { type: "string" },
          },
          required: ["isPresent", "engines", "comment"],
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["score", "statement", "aiPresence", "recommendations"],
    },
  },
  required: ["websiteSummary", "firstImpression", "positioning", "clarity", "aeo"],
};
