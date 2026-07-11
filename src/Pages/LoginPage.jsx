import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";

//SchemaValidation For signupform
const Signupschema = z.object({
  emailId: z.email("Invalid Email..."),
  password: z.string().min(8, "Password is to weak..."),
});


function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Signupschema),
  });

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-2">
            Login 
          </h2>

          <p className="text-center text-base-content/70 mb-6">
            Login Genius 🚀
          </p>

          <form
            onSubmit={handleSubmit((data) => console.log(data))}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />

              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2">
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          <button className="btn btn-outline w-full">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}


export default LoginPage;