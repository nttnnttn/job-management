import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./create.module.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      description: form.description,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("❌ No token found. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Server error:", err);
        alert("Error creating job: " + err);
        return;
      }

      alert("Job created!");
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Job</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="title"
          className={styles.input}
          placeholder="Title"
          onChange={handleChange}
          required
        />

        <input
          name="company"
          className={styles.input}
          placeholder="Company"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          className={styles.input}
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <div className={styles.row}>
          <input
            name="salaryMin"
            className={styles.input}
            placeholder="Salary Min"
            onChange={handleChange}
          />

          <input
            name="salaryMax"
            className={styles.input}
            placeholder="Salary Max"
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          className={styles.textarea}
          placeholder="Description"
          onChange={handleChange}
        />

        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
}
