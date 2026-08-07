import { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient.js";

function UpdateProblem() {
  const [fetchProb, setFetchProb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function getProblem() {
      try {
        setLoading(true);
        const result = await axiosClient.get("/user/GetAllProblem");
        if (!cancelled) setFetchProb(result.data);
      } catch (err) {
        if (!cancelled) setLoadError(err?.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getProblem();
    return () => {
      cancelled = true;
    };
  }, []); // <-- empty array: run once on mount

  if (loading) return <div className="p-6 text-center">Loading problems...</div>;

  if (loadError)
    return <div className="p-6 text-center text-error">Error: {loadError}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Problem</h1>

      {fetchProb.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {fetchProb.map((prob) => (
            <Link
              key={prob._id}
              to={`/admin/updateProblem/${prob._id}`}
              className="flex justify-between items-center p-3 rounded-lg border border-base-300 hover:bg-base-200 transition"
            >
              <span className="font-medium">{prob.title}</span>
              <span
                className={`badge ${
                  prob.difficultylevel === "easy"
                    ? "badge-success"
                    : prob.difficultylevel === "medium"
                    ? "badge-warning"
                    : "badge-error"
                }`}
              >
                {prob.difficultylevel}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpdateProblem;