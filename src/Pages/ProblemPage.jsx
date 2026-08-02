import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchProblemById, runCode, submitCode } from "../Api/problemApi.jsx";
import { TO_SUBMISSION_LANGUAGE, LANGUAGE_LABEL } from "../components/languageMap.jsx";
import ProblemDescription from "../components/ProblemDescription.jsx";
import CodeEditor from "../components/codeeditor.jsx";
import TestCasePanel from "../components/testCasepanel.jsx";
import ConsoleOutput from "../components/consoleOutput.jsx";
import SubmissionTable from "../components/submissiontable.jsx";
import axiosClient from "../utils/axiosClient.js";



const DIFFICULTY_STYLE = {
  easy: { dot: "bg-emerald-400", text: "text-emerald-400", ring: "ring-emerald-400/30" },
  medium: { dot: "bg-amber-400", text: "text-amber-400", ring: "ring-amber-400/30" },
  hard: { dot: "bg-red-400", text: "text-red-400", ring: "ring-red-400/30" },
};

const PlayIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M6 4.5v11l9-5.5-9-5.5Z" />
  </svg>
);

const CheckCircleIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.9-4.2 4.2-1.9-1.9a.9.9 0 1 0-1.27 1.28l2.55 2.55a.9.9 0 0 0 1.27 0l4.83-4.84A.9.9 0 1 0 13.7 8.1Z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.79 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

function ProblemPage() {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitted, setsubmitted] = useState(false);

  const [leftTab, setLeftTab] = useState("description");
  const [bottomTab, setBottomTab] = useState("testcase");

  const [language, setLanguage] = useState("");
  const [codeByLanguage, setCodeByLanguage] = useState({});

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null); // raw array from RunCode
  const [submitResult, setSubmitResult] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadError("");
        const { data } = await fetchProblemById(problemId);
        if (cancelled) return;

        setProblem(data);

        const initialCode = {};
        (data.startCode || []).forEach((sc) => {
          initialCode[sc.language] = sc.initialCode;
        });
        setCodeByLanguage(initialCode);
        setLanguage(data.startCode?.[0]?.language || "");
      } catch (err) {
        if (!cancelled) setLoadError(err?.response?.data || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (problemId) load();
    return () => {
      cancelled = true;
    };
  }, [problemId]);

  useEffect(() => {
    let cancelled=false;
    const fetchSolvedproblem = async () => {
      try {
        const result = await axiosClient.get("/user/ProblemSolvedByUser");
        if(cancelled)return;
        const ans = result.data.some((k) => k._id === problemId);
        setsubmitted(ans);
      } catch (error) {
        if(!cancelled)console.log("Error: ", error);
      }
    };
    if(problemId)fetchSolvedproblem();
    return ()=>{
      cancelled=true;
    };
  }, [submitResult,problemId]);

  const code = codeByLanguage[language] ?? "";
  const setCode = (value) =>
    setCodeByLanguage((prev) => ({ ...prev, [language]: value }));

  const availableLanguages = useMemo(
    () => (problem?.startCode || []).map((sc) => sc.language),
    [problem]
  );

  const buildPayload = () => ({
    code,
    language: TO_SUBMISSION_LANGUAGE[language] || language,
  });

  const handleRun = async () => {
    setRunning(true);
    setActionError("");
    setRunResult(null);
    setBottomTab("result");
    try {
      const { data } = await runCode(problemId, buildPayload());
      setRunResult(data);
      setBottomTab("testcase");
    } catch (err) {
      setActionError(err?.response?.data || err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setActionError("");
    setSubmitResult(null);
    setBottomTab("result");
    try {
      const {data}=await submitCode(problemId, buildPayload());
      // SubmitCode currently responds with the plain string "Submitted_Result..."
      // rather than the saved doc, so we can't show verdict/runtime here yet.
      // Once you return the saved SubmissionS doc from the controller, swap
      // this to read verdict/runtime/memory/testCasesPassed straight off it.
      setSubmitResult(data);
      setLeftTab("submissions");
    } catch (err) {
      setActionError(err?.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const diff = DIFFICULTY_STYLE[problem?.difficultylevel] || {
    dot: "bg-slate-400",
    text: "text-slate-400",
    ring: "ring-slate-400/30",
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[#0B0E14]">
        <span className="loading loading-dots loading-lg text-teal-400" />
        <span className="font-mono text-xs tracking-widest text-[#6B7686]">
          COMPILING WORKSPACE…
        </span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0E14] p-4">
        <div className="max-w-md w-full rounded-lg border border-red-400/30 bg-[#1a1012] px-4 py-3 font-mono text-sm text-red-300">
          <span className="text-red-400">✗ error:</span> {String(loadError)}
        </div>
      </div>
    );
  }

  return (
    <div className="cj-page h-screen w-full flex flex-col bg-[#0B0E14] text-[#E6EDF3] overflow-hidden">
      <style>{`
        .cj-page { font-family: Inter, system-ui, sans-serif; }
        .cj-mono { font-family: "JetBrains Mono", ui-monospace, "Fira Code", monospace; }
        .cj-cursor::after {
          content: "";
          display: inline-block;
          width: 7px;
          height: 1.05em;
          margin-left: 3px;
          background: currentColor;
          vertical-align: -2px;
          animation: cj-blink 1.1s step-end infinite;
        }
        @keyframes cj-blink { 50% { opacity: 0; } }
        .cj-solved-glow { box-shadow: 0 0 0 1px rgba(63,185,80,0.35), 0 0 14px rgba(63,185,80,0.18); }
        .cj-tab { position: relative; }
        .cj-tab[data-active="true"]::after {
          content: "";
          position: absolute;
          left: 10px; right: 10px; bottom: -1px;
          height: 2px;
          background: #2DD4BF;
          box-shadow: 0 0 8px rgba(45,212,191,0.6);
        }
        .cj-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .cj-scroll::-webkit-scrollbar-track { background: transparent; }
        .cj-scroll::-webkit-scrollbar-thumb { background: #1F2733; border-radius: 8px; }
        .cj-scroll::-webkit-scrollbar-thumb:hover { background: #2A3442; }
        .cj-dotgrid {
          background-image: radial-gradient(rgba(230,237,243,0.06) 1px, transparent 1px);
          background-size: 14px 14px;
        }
        *:focus-visible { outline: 2px solid #2DD4BF; outline-offset: 2px; }
      `}</style>

      {/* Navbar */}
      <div className="flex items-center h-14 px-4 border-b border-[#1F2733] bg-[#0D1117] shrink-0">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="cj-mono cj-cursor text-lg font-bold text-teal-400 tracking-tight">
            CodeJudge
          </span>

          <span className="h-4 w-px bg-[#1F2733]" />

          {problem && (
            <span
              className={`cj-mono inline-flex items-center gap-1.5 rounded-full border border-[#1F2733] bg-[#10141C] px-2.5 py-1 text-[11px] uppercase tracking-wider ${diff.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
              {problem.difficultylevel}
            </span>
          )}

          {submitted && (
            <span className="cj-mono cj-solved-glow inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <CheckCircleIcon />
              Solved
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left panel */}
        <div className="w-[42%] min-w-[340px] flex flex-col border-r border-[#1F2733] bg-[#0D1117]">
          <div className="flex items-center gap-1 px-3 pt-2 border-b border-[#1F2733]">
            {[
              { key: "description", label: "Description" },
              { key: "submissions", label: "Submissions" },
              { key: "Editorial", label: "Editorial" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                data-active={leftTab === t.key}
                onClick={() => setLeftTab(t.key)}
                className={`cj-tab cj-mono px-3 py-2 text-[12px] uppercase tracking-wide rounded-t-md transition-colors ${
                  leftTab === t.key
                    ? "text-teal-300"
                    : "text-[#6B7686] hover:text-[#B7C2CE]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="cj-scroll flex-1 overflow-y-auto p-5">
            {leftTab === "description" && <ProblemDescription problem={problem} />}
            {leftTab === "submissions" && <SubmissionTable problemId={problemId} />}
            {leftTab === "Editorial" && (
              <p className="cj-mono text-sm text-[#6B7686]">
                // editorial not written yet
              </p>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 h-12 border-b border-[#1F2733] bg-[#0D1117] shrink-0">
            <div className="relative">
              <select
                className="cj-mono appearance-none rounded-md border border-[#1F2733] bg-[#10141C] pl-3 pr-8 py-1.5 text-xs text-[#E6EDF3] focus:border-teal-400/60"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABEL[lang] || lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="cj-mono inline-flex items-center gap-1.5 rounded-md border border-teal-400/40 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-400/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                onClick={handleRun}
                disabled={running || submitting}
              >
                {running ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <PlayIcon /> Run
                  </>
                )}
              </button>
              <button
                type="button"
                className="cj-mono inline-flex items-center gap-1.5 rounded-md bg-teal-400 px-3 py-1.5 text-xs font-semibold text-[#0B0E14] hover:bg-teal-300 disabled:opacity-40 disabled:hover:bg-teal-400 transition-colors"
                onClick={handleSubmit}
                disabled={running || submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <CheckIcon /> Submit
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <CodeEditor language={language} value={code} onChange={setCode} />
          </div>

          <div className="h-56 shrink-0 border-t border-[#1F2733] bg-[#0D1117] flex flex-col">
            <div className="flex items-center gap-1 px-3 pt-2 border-b border-[#1F2733]">
              {[
                { key: "testcase", label: "Testcase" },
                { key: "result", label: "Result" },
                { key: "console", label: "Console" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  data-active={bottomTab === t.key}
                  onClick={() => setBottomTab(t.key)}
                  className={`cj-tab cj-mono px-3 py-1.5 text-[11px] uppercase tracking-wide rounded-t-md transition-colors ${
                    bottomTab === t.key
                      ? "text-teal-300"
                      : "text-[#6B7686] hover:text-[#B7C2CE]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="cj-scroll cj-dotgrid flex-1 overflow-y-auto p-4">
              {bottomTab === "testcase" && (
                <TestCasePanel testcases={problem?.visibleTestcases} runResult={runResult} />
              )}

              {bottomTab === "result" && (
                <div className="space-y-2 cj-mono text-sm">
                  {actionError && (
                    <div className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-300">
                      <span className="text-red-400 font-semibold">✗ </span>
                      {String(actionError)}
                    </div>
                  )}
                  {submitResult && (
                    <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-300">
                      <span className="text-emerald-400 font-semibold">✓ </span>
                      {submitResult.note}
                    </div>
                  )}
                  {!actionError && !submitResult && !running && !submitting && (
                    <p className="text-[#6B7686]">
                      // run or submit to see results here
                    </p>
                  )}
                </div>
              )}

              {bottomTab === "console" && <ConsoleOutput runResult={runResult} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;