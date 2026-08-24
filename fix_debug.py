with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    content = f.read()

# Add a console.log for debug
new_code = """  const payload = await response.json();
  let answer = payload?.choices?.[0]?.message?.content?.trim() || "";
  console.log("Raw answer before strip:", answer);

  // Final safety cleanup: remove any <think> blocks
  answer = answer.replace(/<think>[\\s\\S]*?<\\/think>/gi, "").trim();
  
  // also handle unclosed think blocks just in case
  answer = answer.replace(/<think>[\\s\\S]*/gi, "").trim();
  console.log("Cleaned answer:", answer);"""

content = content.replace("""  const payload = await response.json();
  let answer = payload?.choices?.[0]?.message?.content?.trim() || "";

  // Final safety cleanup: remove any <think> blocks
  answer = answer.replace(/<think>[\\s\\S]*?<\\/think>/gi, "").trim();
  
  // also handle unclosed think blocks just in case
  answer = answer.replace(/<think>[\\s\\S]*/gi, "").trim();""", new_code)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(content)
