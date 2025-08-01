import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CourseListing from "./pages/CourseListing";
import AddCourse from "./pages/AddCourse";
import Settings from "./pages/Settings";
import { useState } from "react";
import Login from "./components/Login";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import JobManagement from "./pages/JobManagement";
import JobPage from "./pages/JobPage";
import CreateJob from "./pages/CreateJob";
import Addmission from "./pages/Addmission";
import AdmissionDetails from "./pages/AdmissionDetails";
import EnrolledStudent from "./pages/EnrolledStudent";
import AcdemicCalender from "./pages/AcdemicCalender";
import Loan from "./pages/Loan";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeDetails from "./pages/EmployeeDetails";

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
            <Route path="/" element={<CourseListing />} />
            <Route path="/createCourse" element={<AddCourse />} />
            <Route path="/enrolledStudents" element={<EnrolledStudent />} />
            <Route path="/job" element={<JobManagement />} />
            <Route path="/job/:slug" element={<JobPage />} />
            <Route path="/createJob" element={<CreateJob />} />
            <Route path="/admission" element={<Addmission />} />
            <Route path="/admission/:id" element={<AdmissionDetails />} />
            <Route path="/calender" element={<AcdemicCalender />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/employeeManagement" element={<EmployeeManagement />} />
            <Route path="/employee-details" element={<EmployeeDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
