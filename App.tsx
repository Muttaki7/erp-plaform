import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/reports/Dashboard";
import UserList from "./pages/userManagement/UserList";
import UserForm from "./pages/userManagement/UserForm";
import RoleManagement from "./pages/userManagement/RoleManagement";
import GLAccountList from "./pages/finance/GLAccountList";
import JournalEntryForm from "./pages/finance/JournalEntryForm";
import BudgetDashboard from "./pages/finance/BudgetDashboard";
import FinanceList from "./pages/finance/FinanceList";
import ItemList from "./pages/inventory/ItemList";
import WarehouseManagement from "./pages/inventory/WarehouseManagement";
import VendorList from "./pages/inventory/VendorList";
import InventoryList from "./pages/inventory/InventoryList";
import PurchaseOrderList from "./pages/procurement/PurchaseOrderList";
import InvoiceManagement from "./pages/procurement/InvoiceManagement";
import EmployeeList from "./pages/hr/EmployeeList";
import LeaveManagement from "./pages/hr/LeaveManagement";
import Payroll from "./pages/hr/Payroll";
import CustomerList from "./pages/sales/CustomerList";
import LeadManagement from "./pages/sales/LeadManagement";
import QuoteForm from "./pages/sales/QuoteForm";
import ProjectDashboard from "./pages/projectManagement/ProjectDashboard";
import TaskList from "./pages/projectManagement/TaskList";
import MilestoneTracker from "./pages/projectManagement/MilestoneTracker";
import DocumentList from "./pages/documentManagement/DocumentList";
import CategoryManagement from "./pages/documentManagement/CategoryManagement";
import WorkflowDesigner from "./pages/workflow/WorkflowDesigner";
import ApprovalQueue from "./pages/workflow/ApprovalQueue";
import Sidebar from "./components/navigation/Sidebar";
import Header from "./components/navigation/Header";
import { User } from "./models/User";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <Header />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/users" element={<Layout><UserList /></Layout>} />
        <Route path="/users/form" element={<Layout><UserForm user={null} onSave={function (user: Omit<User, "id">): void {
          throw new Error("Function not implemented.");
        }} onCancel={function (): void {
          throw new Error("Function not implemented.");
        }} /></Layout>} />
        <Route path="/roles" element={<Layout><RoleManagement /></Layout>} />
        <Route path="/finance" element={<Layout><FinanceList /></Layout>} />
        <Route path="/finance/gl-accounts" element={<Layout><GLAccountList /></Layout>} />
        <Route path="/finance/journal-entries" element={<Layout><JournalEntryForm /></Layout>} />
        <Route path="/finance/budget" element={<Layout><BudgetDashboard /></Layout>} />
        <Route path="/inventory" element={<Layout><InventoryList /></Layout>} />
        <Route path="/inventory/items" element={<Layout><ItemList /></Layout>} />
        <Route path="/inventory/warehouses" element={<Layout><WarehouseManagement /></Layout>} />
        <Route path="/inventory/vendors" element={<Layout><VendorList /></Layout>} />
        <Route path="/procurement/orders" element={<Layout><PurchaseOrderList /></Layout>} />
        <Route path="/procurement/invoices" element={<Layout><InvoiceManagement /></Layout>} />
        <Route path="/hr/employees" element={<Layout><EmployeeList /></Layout>} />
        <Route path="/hr/leave" element={<Layout><LeaveManagement /></Layout>} />
        <Route path="/hr/payroll" element={<Layout><Payroll /></Layout>} />
        <Route path="/sales/customers" element={<Layout><CustomerList /></Layout>} />
        <Route path="/sales/leads" element={<Layout><LeadManagement /></Layout>} />
        <Route path="/sales/quotes" element={<Layout><QuoteForm /></Layout>} />
        <Route path="/projects/dashboard" element={<Layout><ProjectDashboard /></Layout>} />
        <Route path="/projects/tasks" element={<Layout><TaskList /></Layout>} />
        <Route path="/projects/milestones" element={<Layout><MilestoneTracker /></Layout>} />
        <Route path="/documents" element={<Layout><DocumentList /></Layout>} />
        <Route path="/documents/categories" element={<Layout><CategoryManagement /></Layout>} />
        <Route path="/workflow/designer" element={<Layout><WorkflowDesigner /></Layout>} />
        <Route path="/workflow/approvals" element={<Layout><ApprovalQueue /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
