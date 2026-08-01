// RunCode builds its Judge0 batch in the same order as Problem.visibleTestcases,
// so runResult[i] corresponds to testcases[i]. status.id === 3 means Judge0
// itself matched stdout against the expected_output you sent it.

const STATUS_STYLE = {
  3: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" }, // Accepted
  4: { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" }, // Wrong Answer
  default: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" }, // compiling / TLE / error / etc.
};

function splitLines(value) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function InputRows({ input }) {
  const lines = splitLines(input);
  if (!lines.length) {
    return <span className="text-[#6B7686]">—</span>;
  }
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => (
        <div key={idx} className="flex items-baseline gap-2">
          <span className="text-[#6B7686] shrink-0">arg{lines.length > 1 ? idx + 1 : ""}</span>
          <span className="text-[#E6EDF3] break-all">{line}</span>
        </div>
      ))}
    </div>
  );
}

function OutputRow({ label, value, tone }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[#6B7686] shrink-0">{label}</span>
      <span className={`break-all ${tone || "text-[#E6EDF3]"}`}>
        {value === null || value === undefined || value === "" ? (
          <span className="text-[#6B7686] italic">empty</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

export default function TestCasePanel({ testcases, runResult }) {
  if (!testcases?.length) {
    return (
      <p className="cj-mono text-sm text-[#6B7686]">// no visible testcases</p>
    );
  }

  return (
    <div className="space-y-3">
      {testcases.map((tc, i) => {
        const result = runResult?.[i];
        const passed = result?.status?.id === 3;
        const style = result
          ? STATUS_STYLE[result.status?.id] || STATUS_STYLE.default
          : null;

        return (
          <div
            key={i}
            className={`cj-mono rounded-lg border bg-[#0D1117] text-sm transition-colors ${
              result ? style.border : "border-[#1F2733]"
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#1F2733]">
              <span className="text-xs uppercase tracking-wider text-[#6B7686]">
                Case {i + 1}
              </span>
              {result && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style.text} ${style.bg}`}
                >
                  {passed ? "✓" : "✗"} {result.status?.description || "—"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 px-3 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B7686] mb-1">
                  Input
                </div>
                <InputRows input={tc.input} />
              </div>

              <div className="space-y-1.5">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#6B7686] mb-1">
                    Expected
                  </div>
                  <OutputRow label="→" value={tc.output} />
                </div>

                {result && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#6B7686] mb-1">
                      Your output
                    </div>
                    <OutputRow
                      label="→"
                      value={result.stdout}
                      tone={passed ? "text-emerald-300" : "text-red-300"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}