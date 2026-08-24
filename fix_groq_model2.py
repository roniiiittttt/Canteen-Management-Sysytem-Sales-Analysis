with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('let model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";', 'let model = process.env.GROQ_MODEL || "mixtral-8x7b-32768";')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
