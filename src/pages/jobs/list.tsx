import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function JobListPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const loadJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs?page=${page}&limit=${limit}`);
      const data = await res.json();

      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page]);

  const deleteJob = async (id: string) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
      loadJobs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>

        <button
          onClick={() => navigate("/jobs/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + New Job
        </button>
      </div>

      {/* Table container */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-semibold">Title</th>
              <th className="p-3 text-left font-semibold">Location</th>
              <th className="p-3 text-left font-semibold">Salary</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Không có job nào
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{job.title}</td>
                  <td className="p-3">{job.location}</td>
                  <td className="p-3">{job.salary}</td>

                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/jobs/update/${job._id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-4 transition"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => deleteJob(job._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Prev
        </button>

        <span className="font-medium text-lg">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
