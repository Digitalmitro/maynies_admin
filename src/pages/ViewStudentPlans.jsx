import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function ViewStudentPlans() {
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const fetchStudentPlans = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin?page=${page}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setPlans(data?.data || []);
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error("Error fetching student plans:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentPlans();
  }, []);

  return (
    <div className="p-4 mt-10">
      {/* Header with Create Plan button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-xl font-bold">Student Plans</h1>
        <button
          onClick={() => navigate("/create-plan")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Plan
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p>Loading...</p>
      ) : plans.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Payment Type</th>
                <th className="p-2 border">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{plan.name}</td>
                  <td className="p-2 border">{plan.description}</td>
                  <td className="p-2 border">{plan.paymentType}</td>
                  <td className="p-2 border">₹{plan.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No plans found</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          disabled={pagination.page === 1}
          onClick={() => fetchStudentPlans(pagination.page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => fetchStudentPlans(pagination.page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ViewStudentPlans;
