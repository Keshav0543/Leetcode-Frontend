import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

//Schema Validation
const ProblemSchema = z.object({
  title: z.string().min(1, "Length must be atleast 1 character..."),
  description: z.string().min(1, "Length must be atleast 1 character..."),
  difficultylevel: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "graph", "linked-list", "dp", "binary-search"]),
  visibleTestcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required..."),
        output: z.string(),
        explanation: z.string().min(1, "Explanation is required..."),
      }),
    )
    .min(1, "atleast one visibleTestcases is required..."),
  invisibleTestcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required..."),
        output: z.string(),
      }),
    )
    .min(1, "atleast one invisibleTestcases is required..."),
  startCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string().min(1, "initialCode is required..."),
      }),
    )
    .length(3, "All Three language is required..."),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string().min(1, "Complete code is required..."),
      }),
    )
    .length(3, "All three language is required..."),
});

function Admin() {
  
  const {
  register,
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(ProblemSchema),
  defaultValues: {
    visibleTestcases: [
      {
        input: "",
        output: "",
        explanation: "",
      },
    ],
    invisibleTestcases: [
      {
        input: "",
        output: "",
      },
    ],
    startCode: [
      { language: "c++", initialCode: "" },
      { language: "java", initialCode: "" },
      { language: "javascript", initialCode: "" },
    ],
    referenceSolution: [
      { language: "c++", initialCode: "" },
      { language: "java", initialCode: "" },
      { language: "javascript", initialCode: "" },
    ],
  },
});
  const {
  fields: visibleFields,
  append: appendVisible,
  remove: removeVisible,
} = useFieldArray({
  control,
  name: "visibleTestcases",
});

const {
  fields: hiddenFields,
  append: appendHidden,
  remove: removeHidden,
} = useFieldArray({
  control,
  name: "invisibleTestcases",
});
  const navigate=useNavigate();

  const onSubmit= async (data)=>{
    try{
      await axiosClient.post("/user/create",data);
      alert("Problem created Successfully...");
      navigate("/");
    }
    catch(error){
      alert(`Error: ${error.response?.data} || error.message`);
    }
  }
  
  return (
  <div className="min-h-screen bg-base-200 py-10">
    <div className="max-w-7xl mx-auto">

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="text-4xl font-bold text-center mb-8">
            Create Problem
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >

            {/* Title */}

            <div>
              <label className="label">
                <span className="label-text font-bold">
                  Title
                </span>
              </label>

              <input
                {...register("title")}
                className="input input-bordered w-full"
                placeholder="Two Sum"
              />

              <p className="text-error">
                {errors.title?.message}
              </p>
            </div>

            {/* Description */}

            <div>
              <label className="label">
                <span className="label-text font-bold">
                  Description
                </span>
              </label>

              <textarea
                rows={8}
                {...register("description")}
                className="textarea textarea-bordered w-full"
              />

              <p className="text-error">
                {errors.description?.message}
              </p>
            </div>

            {/* Difficulty & Tag */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="label">
                  <span className="label-text font-bold">
                    Difficulty
                  </span>
                </label>

                <select
                  {...register("difficultylevel")}
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <p className="text-error">
                  {errors.difficultylevel?.message}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-bold">
                    Tag
                  </span>
                </label>

                <select
                  {...register("tags")}
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  <option value="array">Array</option>
                  <option value="linked-list">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                  <option value="binary-search">Binary Search</option>
                </select>

                <p className="text-error">
                  {errors.tags?.message}
                </p>
              </div>

            </div>

            {/* Visible Testcases */}

            <div className="divider text-xl font-bold">
              Visible Testcases
            </div>

            {visibleFields.map((field, index) => (

              <div
                key={field.id}
                className="card bg-base-200 p-5 space-y-4"
              >

                <textarea
                  {...register(`visibleTestcases.${index}.input`)}
                  className="textarea textarea-bordered"
                  placeholder="Input"
                />

                <textarea
                  {...register(`visibleTestcases.${index}.output`)}
                  className="textarea textarea-bordered"
                  placeholder="Output"
                />

                <textarea
                  {...register(`visibleTestcases.${index}.explanation`)}
                  className="textarea textarea-bordered"
                  placeholder="Explanation"
                />

                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeVisible(index)}
                >
                  Remove
                </button>

              </div>

            ))}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                appendVisible({
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
            >
              Add Visible Testcase
            </button>

            {/* Hidden */}

            <div className="divider text-xl font-bold">
              Hidden Testcases
            </div>

            {hiddenFields.map((field, index) => (

              <div
                key={field.id}
                className="card bg-base-200 p-5 space-y-4"
              >

                <textarea
                  {...register(`invisibleTestcases.${index}.input`)}
                  className="textarea textarea-bordered"
                  placeholder="Input"
                />

                <textarea
                  {...register(`invisibleTestcases.${index}.output`)}
                  className="textarea textarea-bordered"
                  placeholder="Output"
                />

                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeHidden(index)}
                >
                  Remove
                </button>

              </div>

            ))}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                appendHidden({
                  input: "",
                  output: "",
                })
              }
            >
              Add Hidden Testcase
            </button>

            {/* Starter Code */}

            <div className="divider text-xl font-bold">
              Starter Code
            </div>

            {["c++", "java", "javascript"].map((lang, index) => (

              <div
                key={lang}
                className="card bg-base-200 p-5"
              >

                <h2 className="font-bold text-lg mb-3">
                  {lang.toUpperCase()}
                </h2>

                <input
                  type="hidden"
                  value={lang}
                  {...register(`startCode.${index}.language`)}
                />

                <textarea
                  rows={10}
                  {...register(`startCode.${index}.initialCode`)}
                  className="textarea textarea-bordered w-full font-mono"
                />

              </div>

            ))}

            {/* Reference Solution */}

            <div className="divider text-xl font-bold">
              Reference Solution
            </div>

            {["c++", "java", "javascript"].map((lang, index) => (

              <div
                key={lang}
                className="card bg-base-200 p-5"
              >

                <h2 className="font-bold text-lg mb-3">
                  {lang.toUpperCase()}
                </h2>

                <input
                  type="hidden"
                  value={lang}
                  {...register(`referenceSolution.${index}.language`)}
                />

                <textarea
                  rows={12}
                  {...register(`referenceSolution.${index}.initialCode`)}
                  className="textarea textarea-bordered w-full font-mono"
                />

              </div>

            ))}

            <div className="text-center">

              <button
                className="btn btn-success btn-wide text-lg"
              >
                Create Problem
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  </div>
);
}

export default Admin;