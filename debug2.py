with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('console.log("Raw answer before strip:", answer);', 'console.log("Payload:", JSON.stringify(payload, null, 2));\n  console.log("Raw answer before strip:", answer);')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
