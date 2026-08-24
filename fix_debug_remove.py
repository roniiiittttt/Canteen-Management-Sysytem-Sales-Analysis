with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('console.log("Payload:", JSON.stringify(payload, null, 2));', '')
c = c.replace('console.log("Raw answer before strip:", answer);', '')
c = c.replace('console.log("Cleaned answer:", answer);', '')

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
