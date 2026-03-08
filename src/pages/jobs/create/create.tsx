import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../../../hooks/jobs/useCreateJob";
import styles from "./create.module.css";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJob();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(false); // dùng boolean
  const [fadeOut, setFadeOut] = useState(false); // kiểm soát fade

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "recruiter") {
      navigate("/jobs");
    }
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;

    createJob.mutate(
      {
        title,
        company,
        location,
        salaryMin: Number(salaryMin) || 0,
        salaryMax: Number(salaryMax) || 0,
        description,
        status: "open",
      },
      {
        onSuccess: () => {
          setSuccessMessage(true);

          // fade out sau 1s
          setTimeout(() => setFadeOut(true), 1000);

          // chuyển hướng sau 2s
          setTimeout(() => navigate("/jobs"), 2000);
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Job</h1>

      {/* Thông báo tạo thành công */}
      {successMessage && (
        <div
          className={styles.successMessage}
          style={{ opacity: fadeOut ? 0 : 1 }}
        >
          Tạo job thành công!
        </div>
      )}

      <div className={styles.form}>
        {/* Title */}
        <div>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            placeholder="Enter job title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Company */}
        <div>
          <label className={styles.label}>Company</label>
          <input
            className={styles.input}
            placeholder="Company name..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className={styles.label}>Location</label>
          <input
            className={styles.input}
            placeholder="City / Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Salary Min + Max */}
        <div className={styles.row}>
          <div style={{ flex: 1 }}>
            <label className={styles.label}>Salary Min</label>
            <input
              className={styles.input}
              placeholder="Min salary..."
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className={styles.label}>Salary Max</label>
            <input
              className={styles.input}
              placeholder="Max salary..."
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Enter job description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button className={styles.button} onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
}
