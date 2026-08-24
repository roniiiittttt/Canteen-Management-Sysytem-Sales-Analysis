with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    content = f.read()

# Add logic to strip <think>...</think>
old_code = """  const payload = await response.json();
  const answer = payload?.choices?.[0]?.message?.content?.trim();

  return { answer, provider: providerType };"""

new_code = """  const payload = await response.json();
  let answer = payload?.choices?.[0]?.message?.content?.trim() || "";

  // Final safety cleanup: remove any <think> blocks
  answer = answer.replace(/<think>[\\s\\S]*?<\\/think>/gi, "").trim();
  
  // also handle unclosed think blocks just in case
  answer = answer.replace(/<think>[\\s\\S]*/gi, "").trim();

  return { answer, provider: providerType };"""

content = content.replace(old_code, new_code)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(content)
