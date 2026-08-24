with open("backend/services/analyticsService.js", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("""  return {
    supported: true,
    answer,
    intent,
    provider,
  };""", """  return {
    supported: true,
    answer,
    intent,
    provider,
    chartData: context,
  };""")

with open("backend/services/analyticsService.js", "w", encoding="utf-8") as f:
    f.write(c)
