import re

with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Remove state variables related to AI
c = re.sub(r'const \[aiQuestion, setAiQuestion\] = useState\(""\);\n\s*const \[aiAnswer, setAiAnswer\] = useState\(""\);\n\s*const \[aiIntent, setAiIntent\] = useState\(""\);\n\s*const \[aiChartData, setAiChartData\] = useState\(null\);\n\s*const \[aiLoading, setAiLoading\] = useState\(false\);\n\s*const \[aiError, setAiError\] = useState\(""\);\n', '', c)

# Remove handleAskAi
c = re.sub(r'const handleAskAi = async \(question\) => \{[\s\S]*?^\s*};\n', '', c, flags=re.MULTILINE)

# Remove the AI Business Analyst UI section
ui_regex = r'<div className="ai-card">[\s\S]*?<div className="trend-card">'
c = re.sub(ui_regex, '<div className="trend-card">', c)

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
