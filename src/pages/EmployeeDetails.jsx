import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";

function EmployeeDetails() {
  const locations = useLocation();
  const id = locations.state?.id;

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    base_salary: "",
    bonuses: "",
    deductions: "",
    pay_cycle: "",
    currency: "",
    effective_from: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/employer/admin/employees/${id}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Network response was not ok");
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

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalarySubmit = async (e) => {
  e.preventDefault();

  // Convert string values to numbers
  const formattedSalaryForm = {
    ...salaryForm,
    base_salary: Number(salaryForm.base_salary),
    bonuses: Number(salaryForm.bonuses),
    deductions: Number(salaryForm.deductions),
  };

  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/employer/admin/salary/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedSalaryForm),
      }
    );

    if (!res.ok) throw new Error("Failed to add salary info");
    alert("Salary info added successfully!");
    setShowSalaryForm(false);

    // Refresh data
    const data = await res.json();
    setEmployeeData((prev) => ({ ...prev, salary: data.salary }));

  } catch (err) {
    console.error(err);
    alert("Error adding salary info");
  }
};


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
    location,
  } = employee_profile || {};

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Employee Details
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 text-sm">Full Name</p>
          <p className="text-gray-800 font-medium">
            {user_profile?.first_name} {user_profile?.last_name}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Email</p>
          <p className="text-gray-800 font-medium">
            {employee_profile?.user_id?.email || "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Phone</p>
          <p className="text-gray-800 font-medium">
            {user_profile?.contact_number || "—"}
          </p>
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
          <p className="text-gray-800 font-medium">
            {user_profile?.gender || "—"}
          </p>
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
            {date_of_joining
              ? new Date(date_of_joining).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Profile Created At</p>
          <p className="text-gray-800 font-medium">
            {new Date(created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Bio</h3>
        <p className="text-gray-700">
          {user_profile?.bio || "No bio available."}
        </p>
      </div>

      {/* Documents */}
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

      {/* Salary Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Salary Info
        </h3>
        {salary && Object.keys(salary).length > 0 ? (
          <div className="bg-gray-100 p-4 rounded text-sm text-gray-700 space-y-2">
            <p>
              <strong>Base Salary:</strong> ₹{salary.base_salary}
            </p>
            <p>
              <strong>Bonuses:</strong> ₹{salary.bonuses}
            </p>
            <p>
              <strong>Deductions:</strong> ₹{salary.deductions}
            </p>
            <p>
              <strong>Pay Cycle:</strong> {salary.pay_cycle}
            </p>
            <p>
              <strong>Currency:</strong> {salary.currency}
            </p>
            <p>
              <strong>Effective From:</strong>{" "}
              {moment(salary.effective_from).format("DD MMM YYYY")}
            </p>
            <p>
              <strong>Remarks:</strong> {salary.remarks}
            </p>
          </div>
        ) : (
          <>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowSalaryForm(!showSalaryForm)}
            >
              Add Salary Info
            </button>

            {showSalaryForm && (
              <form
                onSubmit={handleSalarySubmit}
                className="mt-4 bg-gray-50 p-4 rounded space-y-3"
              >
                <input
                  type="number"
                  name="base_salary"
                  placeholder="Base Salary"
                  value={salaryForm.base_salary}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="bonuses"
                  placeholder="Bonuses"
                  value={salaryForm.bonuses}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="deductions"
                  placeholder="Deductions"
                  value={salaryForm.deductions}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                />
                <select
                  name="pay_cycle"
                  value={salaryForm.pay_cycle}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Pay Cycle</option>
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="weekly">Weekly</option>
                </select>

                <input
                  type="text"
                  name="currency"
                  placeholder="Currency"
                  value={salaryForm.currency}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  name="effective_from"
                  value={salaryForm.effective_from}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  value={salaryForm.remarks}
                  onChange={handleSalaryChange}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;
