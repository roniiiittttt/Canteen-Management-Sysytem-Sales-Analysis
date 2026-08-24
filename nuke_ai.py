import re

with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Match the entire trend-card that contains AI Business Analyst
regex = r'<div className="trend-card">\s*<div className="trend-header">\s*<h2 className="trend-title">AI Business Analyst</h2>.*?<div className="trend-card">\s*<div className="trend-header">\s*<h2 className="trend-title">Customer Analysis</h2>'

c = re.sub(regex, '<div className="trend-card">\n          <div className="trend-header">\n            <h2 className="trend-title">Customer Analysis</h2>', c, flags=re.DOTALL)

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
