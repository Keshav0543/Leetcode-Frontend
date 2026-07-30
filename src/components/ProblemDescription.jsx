const DIFFICULTY_BADGE = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

export default function ProblemDescription({ problem }) {
  if (!problem) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <div className="flex gap-2 mt-2">
          <span className={`badge ${DIFFICULTY_BADGE[problem.difficultylevel] || "badge-outline"}`}>
            {problem.difficultylevel}
          </span>
          {/* tags is a single string on your schema, not an array */}
          {problem.tags && <span className="badge badge-outline">{problem.tags}</span>}
        </div>
      </div>

      <p className="whitespace-pre-wrap leading-relaxed text-base-content/90">
        {problem.description}
      </p>

      <div className="space-y-3">
        {problem.visibleTestcases?.map((tc, i) => (
          <div key={i} className="mockup-code text-sm">
            <pre data-prefix=">">
              <code>Input: {tc.input}</code>
            </pre>
            <pre data-prefix=">">
              <code>Output: {tc.output}</code>
            </pre>
            {tc.explanation && (
              <pre data-prefix="#" className="text-base-content/50">
                <code>{tc.explanation}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}