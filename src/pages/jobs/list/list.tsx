import React, { useState } from "react";
import { useJobList } from "../../../hooks/jobs/useJobList";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";

import styles from "./list.module.css";

interface MyTokenPayload extends JwtPayload {
  role?: string;
}

export default function JobListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useJobList({ search });
  const deleteJob = useDeleteJob();
  const navigate = useNavigate();

  let role: string | undefined = undefined;

  const accessToken = localStorage.getItem("access_token");

  try {
    if (accessToken != null) {
      const decoded = jwtDecode<MyTokenPayload>(accessToken);
      role = decoded.role;
    }
  } catch (error) {
    console.error("Token không hợp lệ:", error);
  }

  const canCreate = role === "recruiter";
  const canEditDelete = role === "recruiter";

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure to delete this job?")) {
      deleteJob.mutate(id);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Job List</h1>

        {canCreate && (
          <button
            className={styles.newButton}
            onClick={() => navigate("/jobs/create")}
          >
            + Create Job
          </button>
        )}
      </div>

      {/* Search */}
      <input
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {isLoading && <p>Loading jobs...</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Company</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Salary Min</th>
              <th className={styles.th}>Salary Max</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Created At</th>
              <th className={styles.th}>Updated At</th>

              {canEditDelete && <th className={styles.th}>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data?.length === 0 && (
              <tr>
                <td colSpan={10} className={styles.noData}>
                  No jobs found
                </td>
              </tr>
            )}

            {data?.map((job: any) => (
              <tr key={job._id} className={styles.row}>
                <td className={styles.td}>{job.title}</td>
                <td className={styles.td}>{job.company}</td>
                <td className={styles.td}>{job.location}</td>
                <td className={styles.td}>{job.status}</td>

                <td className={styles.td}>
                  {job.salaryMin ? `$${job.salaryMin}` : "N/A"}
                </td>

                <td className={styles.td}>
                  {job.salaryMax ? `$${job.salaryMax}` : "N/A"}
                </td>

                <td className={styles.td}>{job.description}</td>

                <td className={styles.td}>
                  {new Date(job.createdAt).toLocaleString()}
                </td>

                <td className={styles.td}>
                  {new Date(job.updatedAt).toLocaleString()}
                </td>

                {canEditDelete && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/jobs/update/${job._id}`)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(job._id)}
                      >
                        🗑 Delete
                      </button>

                      <button
                        className={styles.viewBtn}
                        onClick={() => navigate(`/candidates/${job._id}`)}
                      >
                        👥 Candidates
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
