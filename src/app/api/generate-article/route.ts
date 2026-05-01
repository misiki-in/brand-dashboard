import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(req: NextRequest) {
  try {
    const { keyword, title, contentType, writingStyle, tone, instructions } = await req.json();

    if (!keyword || !title) {
      return NextResponse.json({ error: "keyword and title are required" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const styleMap: Record<string, string> = {
      your_style: "Match the brand's existing tone",
      casual: "Friendly, conversational, approachable",
      professional: "Formal, authoritative, business-focused",
      luxury: "Sophisticated, elegant, aspirational, premium feel",
    };

    const styleDesc = styleMap[writingStyle] || styleMap.luxury;

    const prompt = `You are a professional content writer for Varni Jewels, a luxury Indian jewelry brand. Write a comprehensive ${contentType} article.

TITLE: ${title}
KEYWORD: ${keyword}
WRITING STYLE: ${styleDesc}
TONE: ${tone || "Sophisticated and elegant, reflecting the heritage and craftsmanship of fine jewelry."}
${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}` : ""}

REQUIREMENTS:
1. Write the article in Markdown format with proper headers (##, ###)
2. Include an engaging introduction that hooks the reader
3. Cover the topic comprehensively (aim for 1500-2500 words equivalent)
4. Naturally incorporate the target keyword "${keyword}" throughout
5. Include practical tips, examples, or comparisons where relevant
6. Write a compelling conclusion with a call to action for Varni Jewels
7. Suggest 3-5 internal linking opportunities
8. Generate a meta title (under 60 chars) and meta description (under 155 chars)

RESPOND IN THIS EXACT JSON FORMAT (no markdown code fences):
{
  "title": "${title}",
  "metaTitle": "SEO optimized meta title under 60 chars",
  "metaDescription": "Compelling meta description under 155 chars",
  "outline": ["Section 1 title", "Section 2 title", ...],
  "sections": [
    {"heading": "Section heading", "content": "Full section content in markdown"},
    ...
  ],
  "internalLinks": ["Link suggestion 1", "Link suggestion 2", ...],
  "wordCount": 0
}`;

    const response = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert jewelry content writer. Always respond with valid JSON only, no markdown code fences or additional text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = response.choices[0]?.message?.content || "";

    // Clean up response - remove markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parse fails, create a fallback structure
      parsed = {
        title,
        metaTitle: `${title} | Varni Jewels`,
        metaDescription: `Discover everything about ${keyword} with Varni Jewels' expert guide. Explore styles, tips, and trends.`,
        outline: ["Introduction", `Understanding ${keyword}`, "Key Insights", "Expert Recommendations", "Conclusion"],
        sections: [
          { heading: "Introduction", content: content.slice(0, 500) || `An in-depth look at ${keyword} for jewelry enthusiasts.` },
          { heading: `Understanding ${keyword}`, content: `When it comes to ${keyword}, there are several important factors to consider. Let's explore what makes this topic relevant for jewelry lovers.` },
          { heading: "Key Insights", content: `Here are the key insights about ${keyword} that every buyer should know. From quality considerations to styling tips, we cover it all.` },
          { heading: "Expert Recommendations", content: `At Varni Jewels, we recommend approaching ${keyword} with both knowledge and confidence. Our expert craftsmen bring decades of experience.` },
          { heading: "Conclusion", content: `Whether you're new to ${keyword} or a seasoned enthusiast, Varni Jewels offers curated collections that blend tradition with modern elegance. Visit our showroom or explore online.` },
        ],
        internalLinks: ["/collections/gold", "/collections/diamonds", "/collections/bridal"],
        wordCount: 1200,
      };
    }

    // Calculate word count
    const totalWords = parsed.sections.reduce(
      (sum: number, s: { content: string }) => sum + s.content.split(/\s+/).length,
      0
    );
    parsed.wordCount = totalWords;

    return NextResponse.json({
      success: true,
      article: {
        id: `art-${Date.now()}`,
        ...parsed,
        keyword,
        contentType,
        readingTime: Math.ceil(totalWords / 200),
        status: "draft",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[generate-article] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate article" },
      { status: 500 }
    );
  }
}
