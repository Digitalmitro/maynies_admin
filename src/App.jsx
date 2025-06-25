import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row  bg-[#EDECEC] overflow-hidden ">
       <div className="">
       <Sidebar 
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
       </div>
        <main
          className={`flex-1  p-4 overflow-y-auto ${
            sidebarOpen ? "mt-6 " : "mt-6 md:ml-64"
          } md:mt-0 `}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/createCourse" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
