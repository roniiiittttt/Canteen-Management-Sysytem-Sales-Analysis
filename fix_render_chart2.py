with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('aiChartData?.categoryData', 'aiChartData?.categories')
c = c.replace('aiChartData.categoryData', 'aiChartData.categories')
c = c.replace('aiChartData?.payments?.methods', 'aiChartData?.operationsPayments?.payments?.byMethod')
c = c.replace('aiChartData.payments.methods', 'aiChartData.operationsPayments.payments.byMethod')

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
