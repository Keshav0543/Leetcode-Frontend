import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient.js";

const ESchema = z.object({
  emailId: z
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

function Forgotpass() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(ESchema) });

  const onSubmit = async (data) => {
    try {
      const result = await axiosClient.post("/user/forgotPassword", data);
      alert(result.data);
      reset(); // ab safe hai, form field ke defaultValues pe wapas reset karega
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-1">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Enter your registered email and we'll send you a reset link
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("emailId")}
                placeholder="Enter Your Registered Email"
                className="input input-bordered w-full focus:input-primary"
                disabled={isSubmitting}
              />
              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to={"/login"}
              className="link link-hover text-sm text-primary"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgotpass;