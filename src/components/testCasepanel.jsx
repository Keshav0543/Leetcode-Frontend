// RunCode builds its Judge0 batch in the same order as Problem.visibleTestcases,
// so runResult[i] corresponds to testcases[i]. status.id === 3 means Judge0
// itself matched stdout against the expected_output you sent it.

export default function TestCasePanel({ testcases, runResult }) {
  if (!testcases?.length) {
    return <p className="text-sm text-base-content/60">No visible testcases.</p>;
  }

  return (
    <div className="space-y-3">
      {testcases.map((tc, i) => {
        const result = runResult?.[i];
        const passed = result?.status?.id === 3;
        return (
          <div key={i} className="rounded-lg border border-base-300 p-3 text-sm font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base-content/60">Case {i + 1}</span>
              {result && (
                <span className={`badge badge-sm ${passed ? "badge-success" : "badge-error"}`}>
                  {result.status?.description || "—"}
                </span>
              )}
            </div>
            <div>Input: {tc.input}</div>
            <div>Expected: {tc.output}</div>
            {result && <div>Your Output: {result.stdout ?? "null"}</div>}
          </div>
        );
      })}
    </div>
  );
}