import React, { useState } from "react";
import { useJobList } from "../../../hooks/jobs/useJobList";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";
import { useNavigate } from "react-router-dom";

import styles from "./list.module.css";

export default function JobListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useJobList({ search });
  const deleteJob = useDeleteJob();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Job List</h1>

        <button
          className={styles.newButton}
          onClick={() => navigate("/jobs/create")}
        >
          + Create Job
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search jobs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {isLoading && <p>Loading...</p>}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Company</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Salary</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  No jobs found
                </td>
              </tr>
            )}

            {data?.map((job: any) => (
              <tr key={job._id} className={styles.row}>
                <td className={styles.td}>{job.title}</td>
                <td className={styles.td}>{job.company}</td>
                <td className={styles.td}>{job.location}</td>
                <td className={styles.td}>
                  {job.salaryMin
                    ? `$${job.salaryMin} - $${job.salaryMax}`
                    : "N/A"}
                </td>

                <td className={styles.td}>
                  <div className={styles.actions}>
                    <span
                      className={styles.editBtn}
                      onClick={() => navigate(`/jobs/update/${job._id}`)}
                    >
                      Edit
                    </span>

                    <span
                      className={styles.deleteBtn}
                      onClick={() => deleteJob.mutate(job._id)}
                    >
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
