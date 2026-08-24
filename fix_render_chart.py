with open("frontend/src/pages/SalesAnalysis.jsx", "r", encoding="utf-8") as f:
    c = f.read()

old_render = """                >
                  {aiAnswer}
                </div>"""

new_render = """                >
                  <div style={{ marginBottom: aiChartData ? "16px" : "0" }}>
                    {aiAnswer}
                  </div>
                  {aiIntent === "best_selling_products" && aiChartData?.topProducts && (
                    <div style={{ height: "250px", marginTop: "20px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aiChartData.topProducts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="productName" tick={{fontSize: 12}} />
                          <YAxis yAxisId="left" tick={{fontSize: 12}} />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {aiIntent === "category_performance" && aiChartData?.categoryData && (
                    <div style={{ height: "250px", marginTop: "20px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={aiChartData.categoryData} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                            {aiChartData.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {aiIntent === "operations_payment_summary" && aiChartData?.payments?.methods && (
                    <div style={{ height: "250px", marginTop: "20px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={aiChartData.payments.methods} dataKey="revenue" nameKey="method" cx="50%" cy="50%" outerRadius={80} label>
                            {aiChartData.payments.methods.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#10b981", "#3b82f6", "#f59e0b"][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>"""

c = c.replace(old_render, new_render)

with open("frontend/src/pages/SalesAnalysis.jsx", "w", encoding="utf-8") as f:
    f.write(c)
