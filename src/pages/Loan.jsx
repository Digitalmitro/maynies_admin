import React, { useEffect, useState } from "react";

function Loan() {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchLoanRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employer/loan/admin`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      setLoanRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching loan requests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employer/loan/admin/${loanId}/approve`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setStatusUpdates({
        ...statusUpdates,
        [loanId]: newStatus,
      });
      console.log(`Loan ${loanId} status updated`);
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const saveStatusChanges = async () => {
    try {
      console.log("Status updates to save:", statusUpdates);
      alert("Status updates saved successfully!");
      fetchLoanRequests()
    } catch (error) {
      console.error("Error updating loan statuses:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Requests</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
          <div className="col-span-2">Employee Email</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-4 md:px-6">Reason</div>
          <div className="col-span-2">Request Date</div>
          <div className="col-span-2">Status</div>
        </div>

        {loanRequests.length > 0 ? (
          loanRequests.map((loan) => (
            <div
              key={loan._id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 sm:gap-0 p-4 border-b border-gray-200 sm:hover:bg-gray-50"
            >
              <div className="sm:col-span-2 text-gray-600">
                <span className="sm:hidden font-medium text-gray-500">
                  Email:{" "}
                </span>
                {loan.employeeId.email}
              </div>

              <div className="sm:col-span-1 text-gray-600">
                <span className="sm:hidden font-medium text-gray-500">
                  Amount:{" "}
                </span>
                ₹{loan.amount.toLocaleString()}
              </div>

              <div className="sm:col-span-1 text-gray-600">
                <span className="sm:hidden font-medium text-gray-500">
                  Duration:{" "}
                </span>
                {loan.durationMonths} months
              </div>

              <div className="sm:col-span-4 md:px-6  text-gray-600">
                <span className="sm:hidden font-medium text-gray-500">
                  Reason:{" "}
                </span>
                {loan.reason}
              </div>

              <div className="sm:col-span-2 text-gray-600">
                <span className="sm:hidden font-medium text-gray-500">
                  Requested On:{" "}
                </span>
                {formatDate(loan.createdAt)}
              </div>

              <div className="sm:col-span-2">
                <select
                  value={statusUpdates[loan._id] || loan.status}
                  onChange={(e) => handleStatusChange(loan._id, e.target.value)}
                  disabled={loan.status !== "pending"}
                  className={`w-full outline-none sm:w-auto px-3 py-1 rounded-md border text-sm mt-1 sm:mt-0
    ${
      (statusUpdates[loan._id] || loan.status) === "approved"
        ? "border-green-200 bg-green-50 text-green-700"
        : (statusUpdates[loan._id] || loan.status) === "declined"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-gray-200 bg-gray-50 text-gray-700"
    }
    ${loan.status !== "pending" ? "opacity-60 cursor-not-allowed" : ""}
  `}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No loan requests found
          </div>
        )}
      </div>

      {Object.keys(statusUpdates).length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveStatusChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default Loan;
