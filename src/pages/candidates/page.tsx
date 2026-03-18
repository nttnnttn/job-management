import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCandidatesByJob } from "../../hooks/job-candidate/useCandidatesByJob";

export default function CandidatesPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const auth = useAuth();

   // chỉ recruiter được xem
  if (auth?.role !== "recruiter") {
    return (
      <p style={{ textAlign: "center", marginTop: 80 }}>
        Access denied
      </p>
    );
  }

  const { data, isLoading, error } = useCandidatesByJob(jobId!);

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: 80 }}>
        Loading candidates...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", marginTop: 80 }}>
        Error loading candidates
      </p>
    );
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

      {!data || data.length === 0 ? (
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
            {data.map((item: any) => (
              <tr key={item._id}>
                <td>{item.user?.email}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
