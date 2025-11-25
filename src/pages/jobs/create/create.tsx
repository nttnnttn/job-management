import { useState } from "react";
import { useCreateJob } from "../../../hooks/jobs/useCreateJob";
import styles from "./create.module.css";

export default function CreateJobPage() {
  const createJob = useCreateJob();
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    createJob.mutate({ title });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Job</h1>

      <div className={styles.form}>
        <label className={styles.label}>Job Title</label>
        <input
          className={styles.input}
          placeholder="Enter job title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          Create Job
        </button>
      </div>
    </div>
  );
}
