import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admission() {
  const [admissions, setAdmissions] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true); // Loader state
  const navigate = useNavigate();

  const statusOptions = ["pending", "approved", "rejected"];

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/admission/all`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setAdmissions(data?.admission || []);

        const initialStatuses = {};
        data?.admission?.forEach((item) => {
          initialStatuses[item._id] = item.status;
        });
        setStatuses(initialStatuses);
      } catch (err) {
        console.error("Error fetching admissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  const handleStatusChange = async (admissionId, newStatus) => {
    setStatuses((prev) => ({ ...prev, [admissionId]: newStatus }));

    const admission = admissions.find((a) => a._id === admissionId);
    const userId = admission?._id;
    if (!userId) {
      console.error("User ID not found for admission ID:", admissionId);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/admission/${userId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const result = await res.json();
      console.log("✅ Status updated successfully:", result);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="md:p-6 px-4 py-15">
      <h2 className="text-2xl font-bold mb-4">Admission List</h2>

      {loading ? (
        // Loader
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {admissions.map((admission) => (
            <div
              key={admission._id}
              className="block p-4 border rounded-lg bg-white"
            >
              <div className="flex flex-col md:flex-row flex-wrap justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-semibold">
                    {admission.personal.first_name}{" "}
                    {admission.personal.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {admission.personal.email}
                  </p>
                </div>

                {/* ✅ View Details button */}
                <button
                  onClick={() =>
                    navigate(`/admission/${admission._id}`, {
                      state: { admission },
                    })
                  }
                  className="text-blue-600 underline pt-1 px-4 outline-none"
                >
                  View Details
                </button>

                {/* ✅ Status Dropdown */}
                <select
                  value={statuses[admission._id]}
                  onChange={(e) =>
                    handleStatusChange(admission._id, e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-1 outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admission;
