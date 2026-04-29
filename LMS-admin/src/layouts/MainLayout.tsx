import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-6 py-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/mentor">mentor</Link>
        <Link to="/student">student</Link>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}