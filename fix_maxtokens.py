with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('max_tokens: 150,', 'max_tokens: 400,')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
