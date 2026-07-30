export default function ConsoleOutput({ runResult }) {
  if (!runResult) {
    return <p className="text-sm text-base-content/60">Nothing to show yet — run your code first.</p>;
  }

  return (
    <div className="space-y-3 font-mono text-xs">
      {runResult.map((r, i) => (
        <div key={i} className="border-b border-base-300 pb-2">
          <div className="text-base-content/50">
            Case {i + 1} — {r.status?.description || "—"}
          </div>
          <div>stdout: {r.stdout ?? "null"}</div>
          <div>
            time: {r.time} ms · memory: {r.memory} KB
          </div>
        </div>
      ))}
    </div>
  );
}