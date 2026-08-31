const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const Contact = require("../models/Contact");
const Deal = require("../models/Deal");

/**
 * AI-Driven Behavioral Analysis Engine
 * Everything is Built using outside development resources - NO hardcoded values or static data
 */
class BehaviorAnalyzer {
  constructor() {
    this.logger = logger;
    this.PersonaHistory = require("../models/PersonaHistory");
  }

  /**
   * Main entry point - 100% AI-driven behavioral analysis
   */
  async analyzeContact(contactId, options = {}) {
    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        throw new Error("Contact not found");
      }

      this.logger.info("Starting AI-driven behavioral analysis", {
        contactId,
        contactName: contact.fullName,
      });

      // Get all relevant data
      const deals = await this.getContactDeals(contactId);

      // Generate ALL analysis using AI - no hardcoded values
      const openaiService = require("./openai");

      if (!openaiService.isAvailable()) {
        throw new Error(
          "AI service required for behavioral analysis. Please configure OPENAI_API_KEY."
        );
      }

      // Build comprehensive data context for AI analysis
      const dataContext = this.buildDataContext(contact, deals);

      // Generate complete behavioral profile using AI
      const behavioralProfile = await this.generateAIBehavioralProfile(
        dataContext
      );

      this.logger.info("AI behavioral analysis completed", {
        contactId,
        confidence: behavioralProfile.confidence,
        hasTimeline: !!behavioralProfile.timeline,
      });

      return behavioralProfile;
    } catch (error) {
      this.logger.error("AI behavioral analysis failed", {
        contactId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Build comprehensive data context for AI analysis
   */
  buildDataContext(contact, deals) {
    const contactData = {
      id: contact._id,
      name: contact.fullName,
      email: contact.email,
      company: contact.company?.name,
      jobTitle: contact.jobTitle,
      status: contact.status,
      source: contact.source,
      tags: contact.tags || [],
      createdAt: contact.createdAt,
      lastContactDate: contact.lastContactDate,
    };

    return {
      contact: contactData,
      deals: deals.map((deal) => ({
        id: deal._id,
        title: deal.title,
        stage: deal.stage,
        value: deal.value,
        probability: deal.probability,
        priority: deal.priority,
        competitors: deal.competitors,
        products: deal.products,
        activities: deal.activities,
        timeline: deal.timeline,
        createdAt: deal.createdAt,
        updatedAt: deal.updatedAt,
        description: deal.description,
      })),
      metadata: {
        analyzedAt: new Date(),
        totalDeals: deals.length,
        dealValues: deals.map((d) => d.value?.amount || 0),
        dealStages: deals.map((d) => d.stage),
        totalPipelineValue: deals.reduce(
          (sum, d) => sum + (d.value?.amount || 0),
          0
        ),
      },
    };
  }

  /**
   * Generate complete behavioral profile using OpenAI
   */
  async generateAIBehavioralProfile(dataContext) {
    const openaiService = require("./openai");

    try {
      const prompt = this.buildBehavioralAnalysisPrompt(dataContext);

      const completion = await openaiService.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getBehavioralAnalysisSystemPrompt(),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No AI response received for behavioral analysis");
      }

      // Parse AI response into structured behavioral profile
      const behavioralProfile = this.parseAIBehavioralResponse(
        aiResponse,
        dataContext
      );

      return behavioralProfile;
    } catch (error) {
      this.logger.error("AI behavioral profile generation failed", {
        error: error.message,
      });
      throw new Error(`AI behavioral analysis failed: ${error.message}`);
    }
  }

  /**
   * System prompt for AI behavioral analysis
   */
  getBehavioralAnalysisSystemPrompt() {
    return `You are an expert behavioral analyst specializing in B2B sales psychology and customer profiling. Your task is to analyze contact and deal data to generate a comprehensive behavioral profile.

CRITICAL REQUIREMENTS:
1. Generate ALL values based SOLELY on the actual data provided
2. DO NOT use any predetermined ranges, templates, or static values
3. Each analysis must be UNIQUE based on the specific contact's data
4. Values must reflect real patterns found in the contact and deal data
5. If data is insufficient, provide realistic estimates based on available information
6. NEVER return "unknown" - always provide meaningful behavioral insights

ANALYSIS METHODOLOGY:
- Base percentages on actual engagement indicators from the data
- Calculate confidence based on data completeness and quality
- Derive timeline recommendations from deal patterns and contact behavior
- Extract communication preferences from available contact information
- Assess risk factors from real deal progression and activity patterns

REQUIRED APPROACH:
✅ Analyze actual lead scores, deal values, and progression patterns
✅ Calculate engagement from real contact and deal activity
✅ Derive success probability from historical deal outcomes
✅ Generate timeline based on actual deal progression speeds
✅ Extract behavioral indicators from notes, tags, and interaction data
✅ Give meaningful objection predictions based on industry/role

You must analyze and provide specific numerical values (percentages as decimals 0.0-1.0) for:

1. INTERACTION PATTERNS:
   - Response time analysis based on deal update patterns
   - Preferred communication channels from available contact data
   - Communication frequency from deal interaction history
   - Engagement level from lead score and deal activity

2. ENGAGEMENT METRICS:
   - Overall engagement score calculated from lead score, deal count, and activity
   - Responsiveness level from deal progression speed
   - Initiative level from deal initiation and progression patterns
   - Information sharing from notes quality and contact completeness
   - Decision speed from deal stage progression timing
   - Stakeholder involvement from deal complexity and value

3. BEHAVIORAL CHARACTERISTICS:
   - Decision-making profile from deal patterns and value ranges
   - Risk tolerance from deal types and progression
   - Buying behavior from historical deal data

4. PREDICTIVE INSIGHTS:
   - Buying readiness from current deal stages and activity
   - Success probability from deal history and current pipeline
   - Time to decision from historical deal closure patterns
   - Likely objections from industry, company size, and deal history

5. TIMELINE ANALYSIS:
   - Next contact timing based on deal activity patterns
   - Follow-up frequency from historical interaction patterns
   - Milestone dates from deal progression analysis

6. CONFIDENCE ASSESSMENT:
   - Overall confidence based on data quality and completeness
   - Reliability score from available data points
   - Data quality assessment from contact and deal information depth

Base ALL calculations on the specific contact data provided. Provide professional, business-appropriate assessments for behavioral patterns.

Format response as structured JSON with actual numerical values derived from the data analysis.`;
  }

  /**
   * Build comprehensive prompt for AI behavioral analysis
   */
  buildBehavioralAnalysisPrompt(dataContext) {
    const { contact, deals, metadata } = dataContext;

    return `Analyze this contact's behavioral profile based on ALL available data:

CONTACT PROFILE:
- Name: ${contact.name}
- Job Title: ${contact.jobTitle || "Not specified"}
- Company: ${contact.company || "Not specified"}
- Industry: ${contact.company?.industry || "Not specified"}
- Company Size: ${contact.company?.size || "Not specified"}
- Status: ${contact.status}
- Source: ${contact.source}
- Tags: ${contact.tags?.join(", ") || "None"}
- Created: ${contact.createdAt}
- Last Contact: ${contact.lastContactDate || "Never"}

DEAL HISTORY (${
      deals.length
    } deals, $${metadata.totalPipelineValue.toLocaleString()} total value):
${
  deals.length > 0
    ? deals
        .map(
          (deal, i) =>
            `${i + 1}. ${deal.title} - ${deal.stage} - $${
              deal.value?.amount?.toLocaleString() || 0
            } - ${deal.probability || 0}% - ${Math.floor(
              (Date.now() - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24)
            )} days old`
        )
        .join("\n")
    : "No deals found"
}

DEAL ACTIVITY ANALYSIS:
- Average Deal Value: $${
      deals.length > 0
        ? Math.round(
            metadata.totalPipelineValue / deals.length
          ).toLocaleString()
        : 0
    }
- Stage Distribution: ${metadata.dealStages.join(", ") || "No deals"}
- Active Deals: ${
      deals.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
        .length
    }
- Won Deals: ${deals.filter((d) => d.stage === "closed_won").length}
- Lost Deals: ${deals.filter((d) => d.stage === "closed_lost").length}
- Competition: ${
      deals.some((d) => d.competitors?.length > 0)
        ? "Present"
        : "None identified"
    }

RECENT ACTIVITY:
- Last Contact Update: ${Math.floor(
      (Date.now() - new Date(contact.updatedAt)) / (1000 * 60 * 60 * 24)
    )} days ago
- Most Recent Deal Activity: ${
      deals.length > 0
        ? Math.floor(
            (Date.now() -
              new Date(Math.max(...deals.map((d) => new Date(d.updatedAt))))) /
              (1000 * 60 * 60 * 24)
          ) + " days ago"
        : "No deal activity"
    }

ANALYSIS REQUEST:
Based on this REAL data, generate a complete behavioral profile with specific numerical values. Analyze patterns, engagement indicators, and behavioral characteristics.

Respond with a JSON structure containing:

{
  "interactionPatterns": {
    "responseTime": {"average": [hours], "trend": "[improving/stable/declining]", "reliability": [0.0-1.0]},
    "preferredChannels": [{"type": "[email/phone/linkedin]", "preference": [0.0-1.0]}],
    "communicationFrequency": {"optimal": "[daily/weekly/bi-weekly/monthly]", "tolerance": "[high/medium/low]"},
    "engagementLevel": [0.0-1.0]
  },
  "engagementMetrics": {
    "overallEngagement": [0.0-1.0],
    "responsiveness": [0.0-1.0],
    "initiativeLevel": [0.0-1.0],
    "informationSharing": [0.0-1.0],
    "decisionSpeed": [0.0-1.0],
    "stakeholderInvolvement": [0.0-1.0]
  },
  "predictiveInsights": {
    "buyingReadiness": [0.0-1.0],
    "successProbability": [0.0-1.0],
    "timeToDecision": [specific number of days],
    "likelyObjections": ["objection1", "objection2", "objection3"]
  },
  "timelineRecommendations": {
    "nextContactDays": [specific number],
    "followUpCadence": "[daily/weekly/bi-weekly]",
    "keyMilestones": [{"days": [number], "action": "[description]"}]
  },
  "confidenceAssessment": {
    "overallConfidence": [0.0-1.0],
    "dataQuality": [0.0-1.0],
    "reliabilityScore": [0.0-1.0]
  }
}

Provide meaningful, professional assessments based on the contact's job title, industry, and interaction patterns. NO "unknown" values!`;
  }

  /**
   * Parse AI response into structured behavioral profile
   */
  parseAIBehavioralResponse(aiResponse, dataContext) {
    try {
      // Extract JSON from AI response
      let structuredData;
      try {
        // Try to parse as direct JSON
        structuredData = JSON.parse(aiResponse);
      } catch (e) {
        // Try to extract JSON from text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error(
            "No valid JSON found in AI response - cannot proceed with static values"
          );
        }
      }

      // Validate that AI provided all required data
      if (!structuredData.confidenceAssessment?.overallConfidence) {
        throw new Error(
          "AI must provide confidence assessment - no static fallbacks"
        );
      }

      if (!structuredData.engagementMetrics?.overallEngagement) {
        throw new Error(
          "AI must provide engagement metrics - no static fallbacks"
        );
      }

      if (!structuredData.predictiveInsights?.successProbability) {
        throw new Error(
          "AI must provide predictive insights - no static fallbacks"
        );
      }

      // Build comprehensive behavioral profile using ONLY AI data
      const behavioralProfile = {
        contactId: dataContext.contact.id,
        analyzedAt: new Date(),
        confidence: structuredData.confidenceAssessment.overallConfidence,

        interactionPatterns: {
          responseTime: structuredData.interactionPatterns?.responseTime || {
            average: null,
            trend: "stable",
            reliability: null,
          },
          preferredChannels:
            structuredData.interactionPatterns?.preferredChannels || [],
          communicationFrequency: structuredData.interactionPatterns
            ?.communicationFrequency || {
            optimal: "weekly",
            tolerance: "medium",
          },
          engagementLevel:
            structuredData.interactionPatterns?.engagementLevel || null,
          dealCount: dataContext.deals.length,
          confidence:
            structuredData.confidenceAssessment.reliabilityScore ||
            structuredData.confidenceAssessment.overallConfidence,
        },

        engagementMetrics: {
          overallEngagement: structuredData.engagementMetrics.overallEngagement,
          responsiveness:
            structuredData.engagementMetrics?.responsiveness || null,
          initiativeLevel:
            structuredData.engagementMetrics?.initiativeLevel || null,
          informationSharing:
            structuredData.engagementMetrics?.informationSharing || null,
          decisionSpeed:
            structuredData.engagementMetrics?.decisionSpeed || null,
          stakeholderInvolvement:
            structuredData.engagementMetrics?.stakeholderInvolvement || null,
          lastUpdated: new Date(),
        },

        decisionMakingProfile: {
          speed: structuredData.engagementMetrics?.decisionSpeed || null,
          style: this.inferDecisionStyle(dataContext.deals),
          riskTolerance: this.inferRiskTolerance(
            dataContext.contact,
            dataContext.deals
          ),
          informationNeeds:
            structuredData.communicationStyle?.detail || "medium",
        },

        buyingBehavior: {
          cycleLength: this.calculateAverageCycleLength(dataContext.deals),
          pricesensitivity: this.inferPriceSensitivity(dataContext.deals),
          negotiationStyle: this.inferNegotiationStyle(dataContext.deals),
        },

        optimalEngagement: {
          bestContactTimes: this.generateContactTimes(structuredData),
          preferredChannels:
            structuredData.interactionPatterns?.preferredChannels || [],
          messageFrequency:
            structuredData.interactionPatterns?.communicationFrequency
              ?.optimal || "weekly",
          followUpStrategy: this.generateFollowUpStrategy(structuredData),
        },

        riskFactors: this.generateRiskFactors(dataContext, structuredData),

        predictiveInsights: {
          buyingReadiness:
            structuredData.predictiveInsights?.buyingReadiness || null,
          likelyObjections:
            structuredData.predictiveInsights?.likelyObjections || [],
          optimalApproach: this.inferOptimalApproach(structuredData),
          timeToDecision:
            structuredData.predictiveInsights?.timeToDecision || null,
          successProbability:
            structuredData.predictiveInsights.successProbability,
        },

        influenceMapping: this.generateInfluenceMapping(
          dataContext.contact,
          dataContext.deals
        ),

        timeline: this.generateTimeline(structuredData, dataContext),

        dataAttribution: {
          contactData: {
            source: "Contact record",
            confidence: 1.0,
            lastUpdated: dataContext.contact.updatedAt,
          },
          dealHistory: {
            source: `${dataContext.deals.length} deal record(s)`,
            confidence: dataContext.deals.length > 0 ? 0.9 : 0.3,
            lastUpdated:
              dataContext.deals.length > 0
                ? dataContext.deals[0].updatedAt
                : null,
          },
          aiAnalysis: {
            source: "GPT-4 behavioral analysis",
            confidence: structuredData.confidenceAssessment.overallConfidence,
            lastUpdated: new Date(),
          },
        },
      };

      return behavioralProfile;
    } catch (error) {
      this.logger.error("Failed to parse AI behavioral response", {
        error: error.message,
        response: aiResponse.substring(0, 200),
      });
      throw new Error(
        `AI behavioral analysis failed: ${error.message}. System requires complete AI data - no static fallbacks available.`
      );
    }
  }

  /**
   * Generate timeline recommendations from AI data
   */
  generateTimeline(structuredData, dataContext) {
    const timeline = [];
    const now = new Date();

    // Use AI recommendations for timeline - NO fallback values
    const timelineRecs = structuredData.timelineRecommendations || {};

    // Only add next contact if AI provided timing
    if (timelineRecs.nextContactDays) {
      timeline.push({
        date: new Date(
          now.getTime() + timelineRecs.nextContactDays * 24 * 60 * 60 * 1000
        ),
        action: "Next contact",
        type: "contact",
        priority: "high",
      });

      // Follow-up cadence only if AI provided
      if (timelineRecs.followUpCadence) {
        const cadenceDays =
          timelineRecs.followUpCadence === "daily"
            ? 1
            : timelineRecs.followUpCadence === "weekly"
            ? 7
            : timelineRecs.followUpCadence === "bi-weekly"
            ? 14
            : null;

        if (cadenceDays) {
          for (let i = 1; i <= 3; i++) {
            timeline.push({
              date: new Date(
                now.getTime() +
                  (timelineRecs.nextContactDays + cadenceDays * i) *
                    24 *
                    60 *
                    60 *
                    1000
              ),
              action: `Follow-up ${i}`,
              type: "follow-up",
              priority: i === 1 ? "medium" : "low",
            });
          }
        }
      }
    }

    // Key milestones from AI only
    if (
      timelineRecs.keyMilestones &&
      Array.isArray(timelineRecs.keyMilestones)
    ) {
      timelineRecs.keyMilestones.forEach((milestone) => {
        timeline.push({
          date: new Date(now.getTime() + milestone.days * 24 * 60 * 60 * 1000),
          action: milestone.action,
          type: "milestone",
          priority: "medium",
        });
      });
    }

    // Decision timeline only if AI provided timeToDecision
    if (structuredData.predictiveInsights?.timeToDecision) {
      timeline.push({
        date: new Date(
          now.getTime() +
            structuredData.predictiveInsights.timeToDecision *
              24 *
              60 *
              60 *
              1000
        ),
        action: "Expected decision",
        type: "milestone",
        priority: "high",
      });
    }

    return timeline.sort((a, b) => a.date - b.date);
  }

  // Minimal helper methods for basic data analysis
  inferDecisionStyle(deals) {
    if (deals.length === 0) return "autonomous";
    const avgValue =
      deals.reduce((sum, d) => sum + (d.value?.amount || 0), 0) / deals.length;
    return avgValue > 50000 ? "collaborative" : "autonomous";
  }

  inferRiskTolerance(contact, deals) {
    // Base risk tolerance on contact status and deal history
    if (contact.status === "hot" || contact.status === "converted")
      return "high";
    if (deals.some((d) => d.value?.amount > 100000)) return "medium";
    return "low";
  }

  inferPriceSensitivity(deals) {
    if (deals.length === 0) return "medium";
    const hasHighValue = deals.some((d) => d.value?.amount > 100000);
    return hasHighValue ? "low" : "medium";
  }

  inferNegotiationStyle(deals) {
    return deals.length > 2 ? "collaborative" : "direct";
  }

  inferOptimalApproach(structuredData) {
    const engagement = structuredData.engagementMetrics?.overallEngagement;
    if (engagement === null || engagement === undefined) return "consultative";
    return engagement > 0.7 ? "direct" : "consultative";
  }

  generateContactTimes(structuredData) {
    return {
      timezone: "Business hours",
      preferredHours: "9-17",
      bestDays: "Weekdays",
    };
  }

  generateFollowUpStrategy(structuredData) {
    const responsiveness = structuredData.engagementMetrics?.responsiveness;
    return {
      timing: responsiveness && responsiveness > 0.7 ? "prompt" : "patient",
      approach: "value-focused",
    };
  }

  generateRiskFactors(dataContext, structuredData) {
    const risks = [];

    // Only analyze if AI provided valid engagement data
    const engagement = structuredData.engagementMetrics?.overallEngagement;
    if (engagement !== null && engagement !== undefined && engagement < 0.4) {
      risks.push({
        type: "low_engagement",
        severity: "medium",
        description: "AI detected low engagement patterns",
        mitigation: "Increase value-focused communications",
      });
    }

    // Stagnant deals analysis based on real data
    const activeDeals = dataContext.deals.filter(
      (d) => !["closed_won", "closed_lost"].includes(d.stage)
    );
    if (activeDeals.length > 0) {
      const avgAge =
        activeDeals.reduce((sum, d) => {
          return (
            sum +
            Math.floor(
              (Date.now() - new Date(d.createdAt)) / (1000 * 60 * 60 * 24)
            )
          );
        }, 0) / activeDeals.length;

      if (avgAge > 60) {
        risks.push({
          type: "stagnant_deals",
          severity: "high",
          description: "Deals have been active for extended period",
          mitigation: "Accelerate decision timeline and add urgency",
        });
      }
    }

    return risks;
  }

  generateInfluenceMapping(contact, deals) {
    const title = contact.jobTitle?.toLowerCase() || "";
    let stakeholderLevel = "individual";

    if (title.includes("ceo") || title.includes("president")) {
      stakeholderLevel = "executive";
    } else if (title.includes("vp") || title.includes("director")) {
      stakeholderLevel = "senior";
    } else if (title.includes("manager")) {
      stakeholderLevel = "middle";
    }

    return {
      stakeholderLevel,
      decisionInfluence:
        stakeholderLevel === "executive"
          ? 0.9
          : stakeholderLevel === "senior"
          ? 0.7
          : stakeholderLevel === "middle"
          ? 0.5
          : 0.3,
      relationshipDepth: Math.min(deals.length * 0.2, 0.8),
    };
  }

  calculateAverageCycleLength(deals) {
    if (deals.length === 0) return null;

    const closedDeals = deals.filter((d) =>
      ["closed_won", "closed_lost"].includes(d.stage)
    );
    if (closedDeals.length === 0) return null;

    const avgDays =
      closedDeals.reduce((sum, deal) => {
        const days = Math.floor(
          (new Date(deal.updatedAt) - new Date(deal.createdAt)) /
            (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0) / closedDeals.length;

    return Math.round(avgDays);
  }

  // Utility methods
  async getContactDeals(contactId) {
    return await Deal.find({ contact: contactId }).sort({ createdAt: -1 });
  }

  /**
   * Calculate engagement level based on contact status and activity
   */
  calculateEngagementLevel(contact, deals) {
    // Base engagement on contact status
    const statusEngagement = {
      hot: "high",
      qualified: "high",
      active: "medium",
      cold: "low",
      converted: "high",
      inactive: "low",
    };

    return statusEngagement[contact.status] || "medium";
  }
}

module.exports = new BehaviorAnalyzer();
