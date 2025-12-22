import { Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Inventory from "./pages/Inventory";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="finance" element={<Finance />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
