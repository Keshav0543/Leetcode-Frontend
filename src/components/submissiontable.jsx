const STATUS_LABEL = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  time_limit_exceeded: "Time Limit Exceeded",
  runtime_error: "Runtime Error",
  compilation_error: "Compilation Error",
};

export default function ConsoleOutput({ submitResult }) {
  if (!submitResult || submitResult.length === 0) {
    return (
      <p className="text-sm text-base-content/60">
        Nothing to show yet — submit your code first.
      </p>
    );
  }

  return (
    <div className="space-y-3 font-mono text-xs">
      {submitResult.map((r) => {
        const statusKey = (r.status || "").toLowerCase();
        const accepted = statusKey === "accepted"; 
        const label = STATUS_LABEL[r.status] || r.status || "—";

        return (
          <div key={r._id} className="border-b border-base-300 pb-2">
            <div className={accepted ? "text-emerald-400" : "text-red-400"}>
              {label} {r.testCasesPassed != null && r.totalTestCases != null && (
                <span className="text-base-content/50">
                  ({r.testCasesPassed}/{r.totalTestCases} testcases passed)
                </span>
              )}
            </div>

            {!accepted && r.errorMessage && (
              <div className="text-base-content/60">
                {r.errorMessage}
              </div>
            )}

            <div>
              time: {r.runtime != null ? `${r.runtime} ms` : "—"} · memory:{" "}
              {r.memory != null ? `${r.memory} KB` : "—"}
            </div>

            <div className="text-base-content/40">
              {r.language} · {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}