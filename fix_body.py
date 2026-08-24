import re
with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    content = f.read()

old_body = """      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 220,
        messages: ["""

new_body = """      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 150,
        reasoning_format: "hidden",
        messages: ["""

content = content.replace(old_body, new_body)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(content)
