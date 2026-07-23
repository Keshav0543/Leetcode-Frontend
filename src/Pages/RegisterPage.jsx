import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

//SchemaValidation For signupform
const Signupschema = z
  .object({
    firstName: z
      .string()
      .min(
        3,
        "Name should contain atleast 3 character and maximum 10 character...",
      ),
    emailId: z.email("Invalid Email..."),
    password: z.string().min(8, "Password is to weak..."),
    confirmPassword: z.string().min(8, "Password is to weak..."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const [showPassword, setshowPassword] = useState(false);
  const [showconfirmPassword, setshowconfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Signupschema),
  });
  const navigate = useNavigate();
  const { isAuthenticate , loading} = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticate) navigate("/");
  }, [isAuthenticate]);

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h2>

          <p className="text-center text-base-content/70 mb-6">
            Start your coding journey 🚀
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />

              {errors.firstName && (
                <p className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setshowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            {/* confirmPassword */}
            <div>
              <label className="label">
                <span className="label-text font-medium">confirmPassword</span>
              </label>

              <div className="relative">
                <input
                  type={showconfirmPassword ? "text" : "password"}
                  placeholder="ReEnter Password"
                  className={`input input-bordered w-full pr-12 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() => setshowconfirmPassword(!showconfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showconfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.confirmpassword && (
                <p className="text-error text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? "registering....": "register"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button className="btn btn-outline w-full">
            Continue with Google
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

// function RegisterPage(){
//     const [name,setName]=useState("");
//     const [emailId,setemailId]=useState("");
//     const [password,setPassword]=useState("");

//     const handleSubmit=(e)=>{
//         e.preventDefault();
//         //Validation

//         //Form Submission
//     }

//     return(
//        <form onSubmit={handleSubmit} className="flex flex-col">
//         <input type="text" value={name} placeholder="Enter Your Firstname" onChange={(e)=>setName(e.target.value)}></input>
//         <input type="email" value={emailId} placeholder="Enter Your EmailId" onChange={(e)=>setemailId(e.target.value)}></input>
//         <input type="password" value={password} placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)}></input>
//         <button type="submit">Submit</button>
//        </form>
//     )
// }