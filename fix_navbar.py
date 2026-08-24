with open("frontend/src/components/Navbar.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Add import
import_str = 'import { getMyOrders } from "../services/orderService";\nimport AiSidebar from "./AiSidebar";'
c = c.replace('import { getMyOrders } from "../services/orderService";', import_str)

# Add state
state_str = 'const [toastTimeout, setToastTimeout] = useState(null);\n  const [isAiOpen, setIsAiOpen] = useState(false);'
c = c.replace('const [toastTimeout, setToastTimeout] = useState(null);', state_str)

# Add button
button_old = """          {role === "admin" && (
            <NavLink to="/admin/sales-analysis" className={getLinkClass} style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
              Sales Analysis
            </NavLink>
          )}"""
button_new = """          {role === "admin" && (
            <>
              <NavLink to="/admin/sales-analysis" className={getLinkClass} style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                Sales Analysis
              </NavLink>
              <button 
                onClick={() => setIsAiOpen(true)} 
                className="nav-link" 
                style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', cursor: 'pointer' }}>
                AI Business Analyst
              </button>
            </>
          )}"""
c = c.replace(button_old, button_new)

# Add component
comp_old = """      {/* Floating Global Toast Notification */}
      {toast && (
        <div className={`global-toast ${toast.isHiding ? 'hide' : ''}`}>
          <span className="global-toast-message">{toast.message}</span>
        </div>
      )}
    </>
  );"""
comp_new = """      {/* Floating Global Toast Notification */}
      {toast && (
        <div className={`global-toast ${toast.isHiding ? 'hide' : ''}`}>
          <span className="global-toast-message">{toast.message}</span>
        </div>
      )}
      
      <AiSidebar isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );"""
c = c.replace(comp_old, comp_new)

with open("frontend/src/components/Navbar.jsx", "w", encoding="utf-8") as f:
    f.write(c)
