with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

# We replace: answer = answer.replace(/<think>[\s\S]*/gi, "").trim();
# with an additional strip for common markdown
old_code = """  // also handle unclosed think blocks just in case
  answer = answer.replace(/<think>[\\s\\S]*/gi, "").trim();"""

new_code = """  // also handle unclosed think blocks just in case
  answer = answer.replace(/<think>[\\s\\S]*/gi, "").trim();

  // Strip markdown formatting for a clean plain text UI
  answer = answer.replace(/\\*\\*(.*?)\\*\\*/g, "$1"); // bold **
  answer = answer.replace(/__(.*?)__/g, "$1"); // bold __
  answer = answer.replace(/\\*(.*?)\\*/g, "$1"); // italic *
  answer = answer.replace(/_(.*?)_/g, "$1"); // italic _
  answer = answer.replace(/#(.*?)\\n/g, "$1\\n"); // headings
  """

c = c.replace(old_code, new_code)

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
