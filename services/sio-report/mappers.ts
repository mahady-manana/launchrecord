/**
 * Maps raw AI response to ISIOReport format
 * Ensures all required fields are present and properly typed
 */
export function mapToSIOReport(rawData: any): any {
  return {
    // Overall
    overallScore: rawData.score || 0,
    statement: rawData.statement || "",
    reportBand: getReportBand(rawData.score || 0),
    overallCommentPositive: rawData.overallCommentPositive || [],
    overallCommentNegative: rawData.overallCommentNegative || [],

    // Website Summary
    websiteSummary: {
      summary: rawData.websiteSummary?.summary || "",
      summaryComment: rawData.websiteSummary?.summaryComment || "",
      problems: {
        currents: rawData.websiteSummary?.problems?.currents || [],
        positiveComments:
          rawData.websiteSummary?.problems?.positiveComments || [],
        negativeComments:
          rawData.websiteSummary?.problems?.negativeComments || [],
      },
      outcomes: {
        currents: rawData.websiteSummary?.outcomes?.currents || [],
        positiveComments:
          rawData.websiteSummary?.outcomes?.positiveComments || [],
        negativeComments:
          rawData.websiteSummary?.outcomes?.negativeComments || [],
      },
      solutions: {
        currents: rawData.websiteSummary?.solutions?.currents || [],
        positiveComments:
          rawData.websiteSummary?.solutions?.positiveComments || [],
        negativeComments:
          rawData.websiteSummary?.solutions?.negativeComments || [],
      },
      features: {
        currents: rawData.websiteSummary?.features?.currents || [],
        positiveComments:
          rawData.websiteSummary?.features?.positiveComments || [],
        negativeComments:
          rawData.websiteSummary?.features?.negativeComments || [],
      },
      isPositioningClear: rawData.websiteSummary?.isPositioningClear || false,
      isMessagingClear: rawData.websiteSummary?.isMessagingClear || false,
      areUsersLeftGuessing:
        rawData.websiteSummary?.areUsersLeftGuessing || false,
    },

    // First Impression
    firstImpression: {
      score: rawData.firstImpression?.score || 0,
      statement: rawData.firstImpression?.statement || "",
      overallCommentPositive:
        rawData.firstImpression?.overallCommentPositive || [],
      overallCommentNegative:
        rawData.firstImpression?.overallCommentNegative || [],
      headline: {
        current: rawData.firstImpression?.headline?.current || "",
        positiveComments:
          rawData.firstImpression?.headline?.positiveComments || [],
        negativeComments:
          rawData.firstImpression?.headline?.negativeComments || [],
        suggested: rawData.firstImpression?.headline?.suggested || [],
      },
      subheadline: {
        current: rawData.firstImpression?.subheadline?.current || "",
        positiveComments:
          rawData.firstImpression?.subheadline?.positiveComments || [],
        negativeComments:
          rawData.firstImpression?.subheadline?.negativeComments || [],
        suggested: rawData.firstImpression?.subheadline?.suggested || [],
      },
      cta: {
        current: rawData.firstImpression?.cta?.current || "",
        positiveComments: rawData.firstImpression?.cta?.positiveComments || [],
        negativeComments: rawData.firstImpression?.cta?.negativeComments || [],
        suggested: rawData.firstImpression?.cta?.suggested || [],
      },
    },

    // Positioning
    positioning: {
      score: rawData.positioning?.score || 0,
      statement: rawData.positioning?.statement || "",
      overallCommentPositive: rawData.positioning?.overallCommentPositive || [],
      overallCommentNegative: rawData.positioning?.overallCommentNegative || [],
      summary: {
        current: rawData.positioning?.summary?.current || "",
        positiveComments: rawData.positioning?.summary?.positiveComments || [],
        negativeComments: rawData.positioning?.summary?.negativeComments || [],
        suggested: rawData.positioning?.summary?.suggested || [],
      },
      subMetrics: {
        categoryOwnership: mapSubMetric(
          rawData.positioning?.subMetrics?.categoryOwnership,
        ),
        uniqueValueProp: mapSubMetric(
          rawData.positioning?.subMetrics?.uniqueValueProp,
        ),
        competitiveDiff: mapSubMetric(
          rawData.positioning?.subMetrics?.competitiveDiff,
        ),
        targetAudience: mapSubMetric(
          rawData.positioning?.subMetrics?.targetAudience,
        ),
        problemSolutionFit: mapSubMetric(
          rawData.positioning?.subMetrics?.problemSolutionFit,
        ),
        messagingConsistency: mapSubMetric(
          rawData.positioning?.subMetrics?.messagingConsistency,
        ),
      },
    },

    // Clarity
    clarity: {
      score: rawData.clarity?.score || 0,
      statement: rawData.clarity?.statement || "",
      overallCommentPositive: rawData.clarity?.overallCommentPositive || [],
      overallCommentNegative: rawData.clarity?.overallCommentNegative || [],
      summary: {
        current: rawData.clarity?.summary?.current || "",
        positiveComments: rawData.clarity?.summary?.positiveComments || [],
        negativeComments: rawData.clarity?.summary?.negativeComments || [],
        suggested: rawData.clarity?.summary?.suggested || [],
      },
      unclearSentences: (rawData.clarity?.unclearSentences || []).map(
        (u: any) => ({
          text: u.text || "",
          issue: u.issue || "",
          fix: u.fix || "",
        }),
      ),
      subMetrics: {
        headlineClarity: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.headlineClarity,
        ),
        valueProposition: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.valueProposition,
        ),
        featureBenefitMapping: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.featureBenefitMapping,
        ),
        visualHierarchy: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.visualHierarchy,
        ),
        ctaClarity: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.ctaClarity,
        ),
        proofPlacement: mapClaritySubMetric(
          rawData.clarity?.subMetrics?.proofPlacement,
        ),
      },
    },

    // AEO
    aeo: {
      score: rawData.aeo?.score || 0,
      statement: rawData.aeo?.statement || "",
      aiPresence: {
        isPresent: rawData.aeo?.aiPresence?.isPresent || false,
        engines: rawData.aeo?.aiPresence?.engines || [],
        comment: rawData.aeo?.aiPresence?.comment || "",
      },
      recommendations: rawData.aeo?.recommendations || [],
    },
  };
}

/**
 * Maps positioning sub-metric
 */
export function mapSubMetric(raw: any) {
  return {
    name: raw?.name || "",
    score: raw?.score || 0,
    current: raw?.current || "",
    positiveComments: raw?.positiveComments || [],
    negativeComments: raw?.negativeComments || [],
    suggested: raw?.suggested || [],
  };
}

/**
 * Maps clarity sub-metric with unclearTexts
 */
export function mapClaritySubMetric(raw: any) {
  return {
    name: raw?.name || "",
    score: raw?.score || 0,
    current: raw?.current || "",
    positiveComments: raw?.positiveComments || [],
    negativeComments: raw?.negativeComments || [],
    suggested: raw?.suggested || [],
    unclearTexts: (raw?.unclearTexts || []).map((u: any) => ({
      text: u.text || "",
      issue: u.issue || "",
      fix: u.fix || "",
    })),
  };
}

/**
 * Gets report band based on score
 */
export function getReportBand(
  score: number,
): "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost" {
  if (score >= 90) return "Dominant";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Blended";
  if (score >= 30) return "Weak";
  return "Ghost";
}
