import re

with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Replace any lingering <div className="ai-card">...</div> if the previous regex missed it
# Wait, let's just find anything referencing aiQuestion or aiLoading
ai_card_regex = r'<div className="ai-card">[\s\S]*?<div className="trend-card">'
if '<div className="ai-card">' in c:
    c = re.sub(ai_card_regex, '<div className="trend-card">', c)

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
