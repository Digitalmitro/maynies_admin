import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const statuses = [
  "applied",
  "shortlisted",
  "interviewed",
  "hired",
  "rejected",
  "withdrawn",
];

function JobPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const jobId = location.state?.jobId;
  const jobTitle = location.state?.jobTitle;

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}/applications`,
        { withCredentials: true }
      );
      setApplications(res.data.data || []);
      console.log(res.data.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/applications/${applicationId}/status`,
        { to_status: newStatus },
        { withCredentials: true }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Applicants for {jobTitle || "Job"}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border p-4 rounded shadow bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{app.fullName}</p>
                <p className="text-sm text-gray-500">{app.email}</p>
                <a
                  href={app.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View Resume
                </a>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {statuses.map((stat) => (
                    <option key={stat} value={stat}>
                      {stat}
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

export default JobPage;
