import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Sidebar() {
    const { logout } = useContext(AuthContext);

    return (
        <aside style={{ width: 200, padding: 10, background: "#eee" }}>
            <h3>ERP</h3>
            <nav>
                <Link to="/">Dashboard</Link><br />
                <Link to="/finance">Finance</Link><br />
                <Link to="/inventory">Inventory</Link><br />
                <Link to="/hr">HR</Link><br />
                <Link to="/crm">CRM</Link><br />
                <Link to="/projects">Projects</Link><br />
                <Link to="/documents">Documents</Link><br />
                <Link to="/reports">Reports</Link><br />
            </nav>
            <button onClick={logout}>Logout</button>
        </aside>
    );
}
