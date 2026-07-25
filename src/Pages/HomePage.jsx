import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector , useDispatch} from "react-redux";
import { Search, Code2, UserCircle2 } from "lucide-react";
import  {logoutUser} from "../authSlice.js";

function HomePage() {
  const [Allproblem, setAllproblem] = useState([]);
  const [userProb, setuserProb] = useState([]);

  const [filters, setfilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [problemRes, userProbres] = await Promise.all([
          axiosClient.get("/user/GetAllProblem"),
          axiosClient.get("/user/ProblemSolvedByUser"),
        ]);

        setAllproblem(problemRes.data);
        setuserProb(userProbres.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  const filteredProblems = Allproblem.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficultylevel.toLowerCase() === filters.difficulty.toLowerCase();

    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "Solved"
        ? userProb.some((sp) => sp._id === problem._id)
        : !userProb.some((sp) => sp._id === problem._id));


    return difficultyMatch && tagMatch && statusMatch;
  });

  async function logoutFunction(){
    try{
      await dispatch(logoutUser()).unwrap();
    }
    catch(error){
      console.log("Error: ",error);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}

      <div className="navbar bg-base-100 shadow-lg px-8">
        <div className="flex-1">
          <a className="text-2xl font-bold flex items-center gap-2">
            <Code2 size={28} />
            CodeJudge
          </a>
        </div>

        <div className="flex gap-4 items-center">
          <button className="btn btn-primary">Contests</button>

          <button className="btn btn-ghost">Problems</button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-circle btn-ghost">
              <UserCircle2 size={30} />
            </label>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 w-52 rounded-box bg-base-100 shadow"
            >
              <li>
                <a>{user?.firstName}</a>
              </li>

              <li>
                <a>Profile</a>
              </li>

              <li>
                <a onClick={logoutFunction}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search + Filters */}

      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-base-100 rounded-xl shadow-md p-6">
          <div className="flex flex-wrap justify-end gap-4">

            {/* Difficulty */}

            <select
              className="select select-bordered"
              value={filters.difficulty}
              onChange={(e) =>
                setfilters({
                  ...filters,
                  difficulty: e.target.value,
                })
              }
            >
              <option value="all">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Tag */}

            <select
              className="select select-bordered"
              value={filters.tag}
              onChange={(e) =>
                setfilters({
                  ...filters,
                  tag: e.target.value,
                })
              }
            >
              <option value="all">Tags</option>
              <option value="array">Array</option>
              <option value="dp">DP</option>
              <option value="graph">Graph</option>
              <option value="tree">Tree</option>
              <option value="string">String</option>
            </select>

            {/* Status */}

            <select
              className="select select-bordered"
              value={filters.status}
              onChange={(e) =>
                setfilters({
                  ...filters,
                  status: e.target.value,
                })
              }
            >
              <option value="all">Status</option>
              <option value="Solved">Solved</option>
              <option value="UnSolved">UnSolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem List */}

      <div className="max-w-7xl mx-auto mt-6 mb-10">
        <div className="overflow-x-auto rounded-xl bg-base-100 shadow-md">
          <table className="table table-zebra">
            <thead>
              <tr className="text-base">
                <th className="w-16 text-center">Status</th>

                <th>Problem</th>

                <th className="text-center">Difficulty</th>

                <th className="text-center">Tags</th>
              </tr>
            </thead>

            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => {
                  const solved = userProb.some((sp) => sp._id === problem._id);

                  return (
                    <tr key={problem._id} className="hover cursor-pointer">
                      {/* Status */}

                      <td className="text-center">
                        {solved ? (
                          <span className="text-success text-xl">✔</span>
                        ) : (
                          <span className="text-base-content/30 text-xl">
                            ○
                          </span>
                        )}
                      </td>

                      {/* Problem Title */}

                      <td>
                        <div className="font-medium hover:text-primary transition">
                          {problem.title}
                        </div>
                      </td>

                      {/* Difficulty */}

                      <td className="text-center">
                        <span
                          className={`badge
                                        ${
                                          problem.difficultylevel === "easy"
                                            ? "badge-success"
                                            : problem.difficultylevel === "medium"
                                              ? "badge-warning"
                                              : "badge-error"
                                        }`}
                        >
                          {problem.difficultylevel}
                        </span>
                      </td>

                      {/* Tags */}

                      <td className="text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {Array.isArray(problem.tags) ? (
                            problem.tags.map((tag) => (
                              <span key={tag} className="badge badge-outline">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-outline">
                              {problem.tags}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No Problems Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomePage;