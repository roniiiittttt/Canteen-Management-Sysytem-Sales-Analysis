import re

with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    content = f.read()

new_func = """const callAiProvider = async ({ question, intent, context }) => {
  let apiKey = process.env.GROQ_API_KEY;
  let providerType = "groq";
  let baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  let model = process.env.GROQ_MODEL || "llama3-8b-8192";

  if (!apiKey || apiKey === 'your_groq_api_key') {
    apiKey = process.env.OPENAI_API_KEY;
    providerType = "openai";
    baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  }

  if (!apiKey || apiKey === 'your_openai_api_key') {
    // Generate a mock response based on the intent since no API key is provided
    let mockAnswer = "This is a simulated AI response. Please add a GROQ_API_KEY to your .env file to enable real AI analysis.\\n\\n";
    
    if (intent === "sales_summary") {
      mockAnswer += `Based on the data, you had $${context.revenue} in total revenue and ${context.orders} orders during this period.`;
    } else if (intent === "sales_change") {
      mockAnswer += `Sales have been relatively stable. Total revenue for this period is $${context.revenue}.`;
    } else if (intent === "best_selling_products") {
      mockAnswer += `Your top selling products are highly popular. The highest volume product sold many units.`;
    } else if (intent === "category_performance") {
      mockAnswer += `Food categories are driving the most revenue, followed by beverages.`;
    } else if (intent === "customer_performance") {
      mockAnswer += `Your top customer is a frequent buyer contributing significantly to overall revenue.`;
    } else if (intent === "peak_hours_days") {
      mockAnswer += `The busiest hour for orders typically falls around lunchtime (12 PM - 1 PM).`;
    } else if (intent === "operations_payment_summary") {
      mockAnswer += `Operations are running smoothly with the majority of orders completed successfully. Payment methods are well distributed.`;
    } else {
      mockAnswer += `I see you are asking about ${question}. Based on the current analytics context, things are looking good.`;
    }

    return {
      answer: mockAnswer,
      provider: "mock",
    };
  }

  const { system, user } = buildAiPrompt({ question, intent, context });

  const response = await fetch(`${baseUrl.replace(/\\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 220,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `AI provider request failed with status ${response.status}: ${errorText.slice(0, 240)}`
    );
  }

  const payload = await response.json();
  const answer = payload?.choices?.[0]?.message?.content?.trim();

  return { answer, provider: providerType };
};"""

# Use regex to replace the old callAiProvider function
# It starts with "const callAiProvider" and ends with "return { answer, provider: "openai" };\n};" or similar. We can match until "const getAiAnalysis = async"
content = re.sub(
    r'const callAiProvider = async \(\{ question, intent, context \}\) => \{.*?^\};\s*const getAiAnalysis = async',
    new_func + '\n\nconst getAiAnalysis = async',
    content,
    flags=re.DOTALL | re.MULTILINE
)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(content)
