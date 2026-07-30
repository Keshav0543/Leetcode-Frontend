import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchProblemById, runCode, submitCode } from "../Api/problemApi.jsx";
import { TO_SUBMISSION_LANGUAGE, LANGUAGE_LABEL } from"../components/languageMap.jsx";
import ProblemDescription from "../components/ProblemDescription.jsx";
import CodeEditor from "../components/codeeditor.jsx";
import TestCasePanel from "../components/testCasepanel.jsx";
import ConsoleOutput from "../components/consoleOutput.jsx"
import SubmissionTable from "../components/submissiontable.jsx";
import axiosClient from "../utils/axiosClient.js";

const DIFFICULTY_BADGE = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

function ProblemPage() {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitted ,setsubmitted] = useState(false);

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

  useEffect(()=>{
    const fetchSolvedproblem=async ()=>{
      try{
        const result=await axiosClient.get("/user/ProblemSolvedByUser");
        const ans=result.data.some((k)=>k._id===problemId);
        if(ans)setsubmitted(true);
      }
      catch(error){
        console.log("Error: ",error);
      }
    }
    fetchSolvedproblem();
  },[problemId]);

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
      await submitCode(problemId, buildPayload());
      // SubmitCode currently responds with the plain string "Submitted_Result..."
      // rather than the saved doc, so we can't show verdict/runtime here yet.
      // Once you return the saved SubmissionS doc from the controller, swap
      // this to read verdict/runtime/memory/testCasesPassed straight off it.
      setSubmitResult({
        note: "Submitted. Check the Submissions tab for the verdict once your GET route is wired up.",
      });
      setLeftTab("submissions");
    } catch (err) {
      setActionError(err?.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-300" data-theme="business">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-300 p-4" data-theme="business">
        <div className="alert alert-error max-w-md">{String(loadError)}</div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full flex flex-col bg-base-300 text-base-content overflow-hidden"
      data-theme="business"
    >
      {/* Navbar */}
      <div className="navbar bg-base-100 border-b border-base-300 min-h-0 h-14 px-4">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xl font-bold text-primary">CodeJudge</span>
          {problem && (
            <span className={`badge badge-sm ${DIFFICULTY_BADGE[problem.difficultylevel] || "badge-outline"}`}>
              {problem.difficultylevel}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left panel */}
        <div className="w-[42%] min-w-[340px] flex flex-col border-r border-base-300 bg-base-100">
          <div role="tablist" className="tabs tabs-bordered px-2">
            <a
              role="tab"
              className={`tab ${leftTab === "description" ? "tab-active" : ""}`}
              onClick={() => setLeftTab("description")}
            >
              Description
            </a>
            <a
              role="tab"
              className={`tab ${leftTab === "submissions" ? "tab-active" : ""}`}
              onClick={() => setLeftTab("submissions")}
            >
              Submissions
            </a>
             <a
              role="tab"
              className={`tab ${leftTab === "Editorial" ? "tab-active" : ""}`}
              onClick={() => setLeftTab("Editorial")}
            >
              Editorial
            </a>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {leftTab === "description" && <ProblemDescription problem={problem} />}
            {leftTab === "submissions" && <SubmissionTable problemId={problemId} />}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 h-12 border-b border-base-300 bg-base-100">
            <select
              className="select select-bordered select-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABEL[lang] || lang}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={handleRun} disabled={running || submitting}>
                {running ? <span className="loading loading-spinner loading-xs" /> : "Run"}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={running || submitting}>
                {submitting ? <span className="loading loading-spinner loading-xs" /> : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <CodeEditor language={language} value={code} onChange={setCode} />
          </div>

          <div className="h-56 shrink-0 border-t border-base-300 bg-base-100 flex flex-col">
            <div role="tablist" className="tabs tabs-bordered px-2">
              <a
                role="tab"
                className={`tab ${bottomTab === "testcase" ? "tab-active" : ""}`}
                onClick={() => setBottomTab("testcase")}
              >
                Testcase
              </a>
              <a
                role="tab"
                className={`tab ${bottomTab === "result" ? "tab-active" : ""}`}
                onClick={() => setBottomTab("result")}
              >
                Result
              </a>
              <a
                role="tab"
                className={`tab ${bottomTab === "console" ? "tab-active" : ""}`}
                onClick={() => setBottomTab("console")}
              >
                Console
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {bottomTab === "testcase" && (
                <TestCasePanel testcases={problem?.visibleTestcases} runResult={runResult} />
              )}

              {bottomTab === "result" && (
                <div className="space-y-2">
                  {actionError && <div className="alert alert-error text-sm">{String(actionError)}</div>}
                  {submitResult && <div className="alert alert-success text-sm">{submitResult.note}</div>}
                  {!actionError && !submitResult && !running && !submitting && (
                    <p className="text-sm text-base-content/60">Run or submit to see results here.</p>
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