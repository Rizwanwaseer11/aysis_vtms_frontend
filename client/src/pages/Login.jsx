import React, { useState } from "react";
import { Eye, EyeClosed, LockKeyhole, Mail } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 overflow-hidden">
      
      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 shadow-2xl"
      >
        <h1 className="text-white text-3xl mt-10 font-semibold">Login</h1>

        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {/* Email Field */}
        <div className="flex items-center w-full mt-6 bg-white/5 ring-1 ring-white/10 focus-within:ring-indigo-500 h-12 rounded-full overflow-hidden pl-6 gap-2 transition">
          <Mail className="text-white/70" size={16} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center mt-4 w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-indigo-500 h-12 rounded-full overflow-hidden pl-6 pr-5 gap-2 transition">
          {/* Lock Icon */}

          <LockKeyhole className="text-white/70" size={16} />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Eye Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white transition"
          >
            {showPassword ? (
              /* Eye Off Icon */
              <EyeClosed className="text-white/70" size={16} />
            ) : (
              /* Eye Icon */
              <Eye className="text-white/70" size={16} />
            )}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-left">
          <button
            type="button"
            className="text-sm text-indigo-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition font-medium mb-10"
        >
          Login
        </button>
      </form>

      {/* Soft Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] to-transparent rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-10 w-[400px] h-[200px] bg-gradient-to-bl from-indigo-700/40 to-transparent rounded-full blur-2xl" />
      
      </div>
    </div>
  );
};

export default Login;


