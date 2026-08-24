with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('const [aiAnswer, setAiAnswer] = useState("");', 'const [aiAnswer, setAiAnswer] = useState("");\n  const [aiIntent, setAiIntent] = useState("");\n  const [aiChartData, setAiChartData] = useState(null);')

c = c.replace('setAiAnswer("");', 'setAiAnswer("");\n      setAiIntent("");\n      setAiChartData(null);')

c = c.replace('setAiAnswer(response.answer || "");', 'setAiAnswer(response.answer || "");\n      setAiIntent(response.intent || "");\n      setAiChartData(response.chartData || null);')

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
