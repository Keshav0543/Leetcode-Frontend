import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

const ProblemSchema = z.object({
  title: z.string().min(1, "Length must be atleast 1 character..."),
  description: z.string().min(1, "Length must be atleast 1 character..."),
  difficultylevel: z.enum(["easy", "medium", "hard"]),
  tags: z.string().trim().min(1, "tags is required to fill..."),
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
  driverCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        code: z.string().min(1, "Driver code is required..."),
      }),
    )
    .length(3, "All three language is required..."),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string().min(1, "Complete code is required..."),
      }),
    )
    .length(3, "All three language is required..."),
});

function EditProblem() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficultylevel: "easy",
      tags: "",
      visibleTestcases: [{ input: "", output: "", explanation: "" }],
      invisibleTestcases: [{ input: "", output: "" }],
      startCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      driverCode: [
        { language: "c++", code: "" },
        { language: "java", code: "" },
        { language: "javascript", code: "" },
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
  } = useFieldArray({ control, name: "visibleTestcases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "invisibleTestcases" });

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Fetch existing problem and auto-fill the form
  useEffect(() => {
    let cancelled = false;

    async function getData() {
      setLoading(true);
      setLoadError("");
      try {
        const result = await axiosClient.get(`/user/problemById/${id}`);
        if (cancelled) return;

        const prob = result.data;

        // Map backend doc -> form shape (reset only touches fields you pass)
        reset({
          title: prob.title ?? "",
          description: prob.description ?? "",
          difficultylevel: prob.difficultylevel ?? prob.difficulty ?? "easy",
          tags: Array.isArray(prob.tags) ? prob.tags.join(", ") : (prob.tags ?? ""),
          visibleTestcases: prob.visibleTestcases?.length
            ? prob.visibleTestcases
            : [{ input: "", output: "", explanation: "" }],
          invisibleTestcases: prob.invisibleTestcases?.length
            ? prob.invisibleTestcases
            : [{ input: "", output: "" }],
          startCode: prob.startCode?.length === 3
            ? prob.startCode
            : [
                { language: "c++", initialCode: "" },
                { language: "java", initialCode: "" },
                { language: "javascript", initialCode: "" },
              ],
          driverCode: prob.driverCode?.length === 3
            ? prob.driverCode
            : [
                { language: "c++", code: "" },
                { language: "java", code: "" },
                { language: "javascript", code: "" },
              ],
          referenceSolution: prob.referenceSolution?.length === 3
            ? prob.referenceSolution
            : [
                { language: "c++", initialCode: "" },
                { language: "java", initialCode: "" },
                { language: "javascript", initialCode: "" },
              ],
        });
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.response?.data?.message || err.message || "Failed to load problem");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) getData();
    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const onSubmit = async (formData) => {
    try {
      await axiosClient.put(`/user/update/${id}`, formData);
      alert("Problem updated successfully...");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error?.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-4">
        <p className="text-error text-lg font-semibold">Error: {loadError}</p>
        <button className="btn btn-primary" onClick={() => navigate("/admin/updateProblem")}>
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center mb-8">Update Problem</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Title */}
              <div>
                <label className="label"><span className="label-text font-bold">Title</span></label>
                <input {...register("title")} className="input input-bordered w-full" placeholder="Two Sum" />
                <p className="text-error">{errors.title?.message}</p>
              </div>

              {/* Description */}
              <div>
                <label className="label"><span className="label-text font-bold">Description</span></label>
                <textarea rows={8} {...register("description")} className="textarea textarea-bordered w-full" />
                <p className="text-error">{errors.description?.message}</p>
              </div>

              {/* Difficulty & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label"><span className="label-text font-bold">Difficulty</span></label>
                  <select {...register("difficultylevel")} className="select select-bordered w-full">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <p className="text-error">{errors.difficultylevel?.message}</p>
                </div>
                <div>
                  <label className="label"><span className="label-text font-bold">Tag</span></label>
                  <input {...register("tags")} className="input input-bordered w-full" placeholder="e.g. array, two-pointer" />
                  <p className="text-error">{errors.tags?.message}</p>
                </div>
              </div>

              {/* Visible Testcases */}
              <div className="divider text-xl font-bold">Visible Testcases</div>
              {visibleFields.map((field, index) => (
                <div key={field.id} className="card bg-base-200 p-5 space-y-4">
                  <textarea {...register(`visibleTestcases.${index}.input`)} className="textarea textarea-bordered" placeholder="Input" />
                  <textarea {...register(`visibleTestcases.${index}.output`)} className="textarea textarea-bordered" placeholder="Output" />
                  <textarea {...register(`visibleTestcases.${index}.explanation`)} className="textarea textarea-bordered" placeholder="Explanation" />
                  <button type="button" className="btn btn-error btn-sm" onClick={() => removeVisible(index)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>
                Add Visible Testcase
              </button>

              {/* Hidden Testcases */}
              <div className="divider text-xl font-bold">Hidden Testcases</div>
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="card bg-base-200 p-5 space-y-4">
                  <textarea {...register(`invisibleTestcases.${index}.input`)} className="textarea textarea-bordered" placeholder="Input" />
                  <textarea {...register(`invisibleTestcases.${index}.output`)} className="textarea textarea-bordered" placeholder="Output" />
                  <button type="button" className="btn btn-error btn-sm" onClick={() => removeHidden(index)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => appendHidden({ input: "", output: "" })}>
                Add Hidden Testcase
              </button>

              {/* Starter Code */}
              <div className="divider text-xl font-bold">Starter Code</div>
              {["c++", "java", "javascript"].map((lang, index) => (
                <div key={lang} className="card bg-base-200 p-5">
                  <h2 className="font-bold text-lg mb-3">{lang.toUpperCase()}</h2>
                  <input type="hidden" value={lang} {...register(`startCode.${index}.language`)} />
                  <textarea rows={10} {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered w-full font-mono" />
                  <p className="text-error">{errors.startCode?.[index]?.initialCode?.message}</p>
                </div>
              ))}

              {/* Driver Code */}
              <div className="divider text-xl font-bold">Driver Code</div>
              {["c++", "java", "javascript"].map((lang, index) => (
                <div key={lang} className="card bg-base-200 p-5 border border-warning/30">
                  <h2 className="font-bold text-lg mb-3">{lang.toUpperCase()} — Driver</h2>
                  <input type="hidden" value={lang} {...register(`driverCode.${index}.language`)} />
                  <textarea rows={12} {...register(`driverCode.${index}.code`)} className="textarea textarea-bordered w-full font-mono" />
                  <p className="text-error">{errors.driverCode?.[index]?.code?.message}</p>
                </div>
              ))}

              {/* Reference Solution */}
              <div className="divider text-xl font-bold">Reference Solution</div>
              {["c++", "java", "javascript"].map((lang, index) => (
                <div key={lang} className="card bg-base-200 p-5">
                  <h2 className="font-bold text-lg mb-3">{lang.toUpperCase()}</h2>
                  <input type="hidden" value={lang} {...register(`referenceSolution.${index}.language`)} />
                  <textarea rows={12} {...register(`referenceSolution.${index}.initialCode`)} className="textarea textarea-bordered w-full font-mono" />
                  <p className="text-error">{errors.referenceSolution?.[index]?.initialCode?.message}</p>
                </div>
              ))}

              <div className="text-center">
                <button className="btn btn-success btn-wide text-lg" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProblem;