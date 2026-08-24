import re
with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('let mockAnswer = "This is a simulated AI response. Please add an OPENAI_API_KEY to your .env file to enable real AI analysis.\n\n";', 'let mockAnswer = "This is a simulated AI response. Please add an OPENAI_API_KEY to your .env file to enable real AI analysis.\\n\\n";')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
