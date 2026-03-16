import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidatesControllerFindAll } from "../../api-client";

interface Candidate {
  _id: string;
  email: string;
  createdAt: string;
}

export default function CandidatesPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await candidatesControllerFindAll();
        if (res.data && Array.isArray(res.data)) {
          setCandidates(res.data as Candidate[]);
        } else {
          setCandidates([]);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading candidates...</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "80px auto" }}>
      {jobId && (
        <button
          onClick={() => navigate("/jobs")}
          style={{ marginBottom: 20 }}
        >
          ← Back to Jobs
        </button>
      )}

      <h2>🧑‍💼 Candidates</h2>

      {candidates.length === 0 ? (
        <p>No candidates found</p>
      ) : (
        <table border={1} cellPadding={10} width="100%">
          <thead>
            <tr>
              <th>Email</th>
              <th>Applied At</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c) => (
              <tr key={c._id}>
                <td>{c.email}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
