import re

with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# state vars
c = re.sub(r'\s*const \[aiQuestion, setAiQuestion\] = useState\(""\);', '', c)
c = re.sub(r'\s*const \[aiAnswer, setAiAnswer\] = useState\(""\);', '', c)
c = re.sub(r'\s*const \[aiIntent, setAiIntent\] = useState\(""\);', '', c)
c = re.sub(r'\s*const \[aiChartData, setAiChartData\] = useState\(null\);', '', c)
c = re.sub(r'\s*const \[aiLoading, setAiLoading\] = useState\(false\);', '', c)
c = re.sub(r'\s*const \[aiError, setAiError\] = useState\(""\);', '', c)

# handleAskAi
c = re.sub(r'\s*const handleAskAi = async \(question\) => \{[\s\S]*?^\s*};\n', '\n', c, flags=re.MULTILINE)

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
