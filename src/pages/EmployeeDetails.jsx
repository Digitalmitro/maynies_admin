import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function EmployeeDetails() {
  const locations = useLocation();
  const id = locations.state?.id;

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/employer/admin/employees/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployeeData(data?.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Employee data not available.
      </div>
    );
  }

  const { employee_profile, salary, user_profile } = employeeData;
  const { 
    work_number, 
    documents, 
    created_at,
    date_of_joining,
    designation,
    location
  } = employee_profile || {};

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 text-sm">Full Name</p>
          <p className="text-gray-800 font-medium">
            {user_profile?.first_name} {user_profile?.last_name}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Email</p>
          <p className="text-gray-800 font-medium">{employee_profile?.user_id?.email || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Phone</p>
          <p className="text-gray-800 font-medium">{user_profile?.contact_number || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Work Number</p>
          <p className="text-gray-800 font-medium">{work_number || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Designation</p>
          <p className="text-gray-800 font-medium">{designation || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Gender</p>
          <p className="text-gray-800 font-medium">{user_profile?.gender || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Location</p>
          <p className="text-gray-800 font-medium">
            {location ? `${location.city}, ${location.country}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Date of Joining</p>
          <p className="text-gray-800 font-medium">
            {date_of_joining ? new Date(date_of_joining).toLocaleDateString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Profile Created At</p>
          <p className="text-gray-800 font-medium">
            {new Date(created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Bio</h3>
        <p className="text-gray-700">
          {user_profile?.bio || "No bio available."}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Documents</h3>
        {documents?.length > 0 ? (
          <ul className="list-disc pl-5 text-blue-600">
            {documents.map((doc, idx) => (
              <li key={idx}>
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}${doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Document {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents uploaded.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Salary Info</h3>
        {salary && Object.keys(salary).length > 0 ? (
          <pre className="bg-gray-100 p-4 rounded text-sm text-gray-700">
            {JSON.stringify(salary, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No salary data available.</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;