import { FaHome, FaUsers, FaCog } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineWork } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { RiLogoutCircleFill } from "react-icons/ri";
import logo from "../assets/logo.svg";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      alert("Logout successful");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <img src={logo} alt="Company Logo" className="h-10 w-10" />
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          transform transition-transform duration-300 ease-in-out
          bg-white w-64 h-full fixed top-0 left-0 z-20
          border-r border-gray-200
          flex flex-col
          md:top-0
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex justify-center items-center border-b border-gray-200 md:mt-0 mt-16">
          <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <FaHome className="text-lg" />
            <span>Course Listing</span>
          </Link>

          <Link
            to="/createCourse"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/createCourse"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <FaUsers className="text-lg" />
            <span>Create new course</span>
          </Link>
          <Link
            to="/loan"
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/loan"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <FaCog className="text-lg" />
            <span>Loan Requests</span>
          </Link>
          <Link
            to="/employeeManagement"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/employeeManagement"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <MdOutlineWork className="text-lg" />
            <span>Employee Management</span>
          </Link>

             <Link
            to="/employee-forms"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/employee-forms"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <MdOutlineWork className="text-lg" />
            <span>Employee Forms </span>
          </Link>
          <Link
            to="/job"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/job"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <MdOutlineWork className="text-lg" />
            <span>Job Management</span>
          </Link>
          <Link
            to="/student"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-2 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/student"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <PiStudentBold className="text-lg" />
            <span>Student Management</span>
          </Link>
          <Link
            to="/calender"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 p-3 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/calender"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <PiStudentBold className="text-lg" />
            <span>Acdemic Calender</span>
          </Link>
          <li
            onClick={handleLogout}
            className={`
              flex items-center gap-3 p-3 rounded-lg 
              hover:bg-gray-100 transition-colors duration-200
              ${
                location.pathname === "/logout"
                  ? "bg-gray-100 font-medium text-[#00953B]"
                  : "text-gray-700"
              }
            `}
          >
            <RiLogoutCircleFill className="text-lg" />
            <span>Logout</span>
          </li>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
