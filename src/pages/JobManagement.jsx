import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/getApi";

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchJobs } = useAuth();
  useEffect(() => {
    const jobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs();
        if (response.error) {
          console.error("Error fetching jobs:", response.error);
          return;
        }
        console.log(response?.data?.jobs);
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      } finally {
        setLoading(false);
      }
    };
    jobs();
    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between  mb-6">
        <h2 className="text-2xl font-bold ">Manage Jobs</h2>
        <button className="text-green-500 rounded border cursor-pointer bg-white px-4 font-semibold" onClick={()=>navigate("/createJob")}>
          + create job
        </button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() =>
                navigate(`/job/${job.slug}`, {
                  state: { jobId: job._id, jobTitle: job.title },
                })
              }
              className="cursor-pointer border border-gray-300 bg-white p-4 rounded-lg hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {job.location || "Remote"}
              </p>
              {/* <p className="text-sm text-gray-500 mt-1">
                {job.applications_count ?? 0} Applications
              </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobManagement;
