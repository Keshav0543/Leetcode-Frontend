import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient.js";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

function DeleteProblem() {
  const [fetchProb, setFetchProb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState(null); // per-row spinner
  const [confirmTarget, setConfirmTarget] = useState(null); // problem selected for confirmation
  const navigate=useNavigate();

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
  }, []);

  const DeleteProb = async (Problem_id) => {
    try {
      setDeletingId(Problem_id);
      await axiosClient.delete(`/user/Delete/${Problem_id}`);
      // Remove from local list instead of re-fetching everything
      setFetchProb((prev) => prev.filter((p) => p._id !== Problem_id));
    } catch (err) {
      setLoadError(err?.response?.data?.message || err.message);
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Delete Problem</h1>

        {loadError && (
          <div className="alert alert-error mb-4">
            <span>{loadError}</span>
          </div>
        )}

        {fetchProb.length === 0 ? (
          <p className="text-center text-base-content/60">No problems found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {fetchProb.map((prob) => (
              <div
                key={prob._id}
                className="flex justify-between items-center p-4 rounded-lg border border-base-300 bg-base-100"
              >
                <div>
                  <p className="font-semibold">{prob.title}</p>
                  <span
                    className={`badge badge-sm mt-1 ${
                      prob.difficultylevel === "easy"
                        ? "badge-success"
                        : prob.difficultylevel === "medium"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {prob.difficultylevel}
                  </span>
                </div>

                <button
                  className="btn btn-error btn-sm"
                  disabled={deletingId === prob._id}
                  onClick={() => setConfirmTarget(prob)}
                >
                  {deletingId === prob._id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmTarget && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Are you sure?</h3>
            <p className="py-4">
              This will permanently delete{" "}
              <span className="font-semibold">"{confirmTarget.title}"</span>. This
              action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmTarget(null)}
                disabled={deletingId === confirmTarget._id}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => DeleteProb(confirmTarget._id)}
                disabled={deletingId === confirmTarget._id}
              >
                {deletingId === confirmTarget._id ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setConfirmTarget(null)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default DeleteProblem;