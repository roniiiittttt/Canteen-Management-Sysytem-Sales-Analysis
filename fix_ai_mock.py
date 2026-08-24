import re

with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    content = f.read()

mock_logic = """  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key') {
    // Generate a mock response based on the intent since no API key is provided
    let mockAnswer = "This is a simulated AI response. Please add an OPENAI_API_KEY to your .env file to enable real AI analysis.\\n\\n";
    
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
  }"""

# Replace the existing apiKey check block
content = re.sub(
    r'const apiKey = process\.env\.OPENAI_API_KEY;\s*if \(!apiKey\) \{.*?return \{.*?answer:.*?provider: null,\s*\};\s*\}',
    mock_logic,
    content,
    flags=re.DOTALL
)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(content)
