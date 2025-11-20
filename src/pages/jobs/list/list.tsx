import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./list.module.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function JobListPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("access_token"); 

      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const res = await fetch(`${API_BASE}/jobs?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load jobs:", await res.text());
        return;
      }

      const data = await res.json();
      setJobs(data);
      setTotal(data.length);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page]);

  const deleteJob = async (jobId: string) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return alert("Missing token");

      const res = await fetch(`${API_BASE}/jobs/${jobId}?jobId=${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      console.log("Delete response:", text);

      if (!res.ok) {
        console.error("Delete failed:", await res.text());
        alert("Delete failed");
        return;
      }

      setJobs((prev) => prev.filter((job) => job._id !== jobId));

      loadJobs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Jobs</h2>

        <button
          onClick={() => navigate("/jobs/create")}
          className={styles.newButton}
        >
          + New Job
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Salary</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.noData}>
                  Không có job nào
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className={styles.row}>
                  <td className={styles.td}>{job.title}</td>
                  <td className={styles.td}>{job.location}</td>
                  <td className={styles.td}>
                    {job.salaryMin} - {job.salaryMax}
                  </td>

                  <td className={`${styles.td} ${styles.actions}`}>
                    <button
                      onClick={() => navigate(`/jobs/update/${job._id}`)}
                      className={styles.editBtn}
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => deleteJob(job._id)}
                      className={styles.deleteBtn}
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
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={
            page === 1
              ? `${styles.pageButton} ${styles.pageButtonDisabled}`
              : styles.pageButton
          }
        >
          Prev
        </button>

        <span className={styles.pageText}>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={
            page === totalPages
              ? `${styles.pageButton} ${styles.pageButtonDisabled}`
              : styles.pageButton
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
