import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import { useState } from "react";
import Login from "./components/Login";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EDECEC] overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 p-4 overflow-y-auto ${
          sidebarOpen ? "mt-6 " : "mt-6 md:ml-64"
        } md:mt-0`}
      >
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
   
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={<Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/createCourse" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
