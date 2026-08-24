with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('reasoning_format: "hidden",', 'reasoning_format: "none",')
c = c.replace('max_tokens: 400,', 'max_tokens: 150,')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
