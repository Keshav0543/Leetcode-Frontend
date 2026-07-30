import axiosClient from "../utils/axiosClient.js";

export const fetchProblemById = (problemId) =>
  axiosClient.get(`/user/ProblemById/${problemId}`);

export const runCode = (problemId, { code, language }) =>
  axiosClient.post(`/user/run/${problemId}`, { code, language });

export const submitCode = (problemId, { code, language }) =>
  axiosClient.post(`/user/submit/${problemId}`, { code, language });

// Stub — you don't have a "get my submissions for a problem" controller yet.
// Add something like:
//   submitRouter.get('/:problemId', userMiddleware, GetSubmissions)
// then swap this in.
// export const fetchSubmissions = (problemId) =>
//   axiosClient.get(`${SUBMISSION_BASE}/${problemId}`);