with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('reasoning_format: "none",', 'reasoning_format: "hidden",')
c = c.replace('max_tokens: 150,', 'max_completion_tokens: 150,')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
