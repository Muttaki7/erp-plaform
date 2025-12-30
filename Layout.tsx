import Sidebar from "../components/Sidebar";

export default function Layout({ children }: any) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main style={{ padding: 20 }}>{children}</main>
        </div>
    );
}
