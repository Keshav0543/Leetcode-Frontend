// Problem.startCode / referenceSolution language values are whatever
// getlanguageId() in Problemutility.js expects — almost certainly lowercase
// keys like "javascript", "cpp", "java", "python".
//
// Submission schema enum requires EXACT casing:
//   ["C","C++","Java","JavaScript","Python","C#","Go","PHP"]
//
// Without this mapping, /run and /submit payloads will fail Mongoose
// validation the moment language !== one of those exact strings.

export const TO_SUBMISSION_LANGUAGE = {
  javascript: "JavaScript",
  cpp: "C++",
  "c++": "C++",
  java: "Java",
  python: "Python",
  c: "C",
};

export const LANGUAGE_LABEL = {
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java",
  python: "Python",
  c: "C",
};

// Monaco's built-in language ids for syntax highlighting
export const MONACO_LANGUAGE = {
  javascript: "javascript",
  "c++": "cpp",
  java: "java",
  python: "python",
  c: "c",
};