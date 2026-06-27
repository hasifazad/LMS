import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}