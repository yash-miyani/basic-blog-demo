"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", api: "" };

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter valid email";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("role", res.data.data.role);
      router.push("/posts");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        api: error?.response?.data?.message || "Login failed",
      }));
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-card border border-border p-6 shadow-md rounded-lg w-80 text-text">
        <h2 className="text-xl font-bold mb-5 text-center">Login</h2>

        {/* Email */}
        <input
          className="border border-border bg-transparent p-2 w-full mb-1 rounded outline-none focus:ring-2 focus:ring-primary"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-danger text-sm mb-2">{errors.email}</p>
        )}

        {/* Password */}
        <div className="mt-2">
          <div className="relative my-1">
          <input
            type={showPassword ? "text" : "password"}
            className="border border-border bg-bg p-2 w-full rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-2 top-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-danger text-sm mb-2">{errors.password}</p>
        )}
        </div>

        <button
          onClick={handleLogin}
          className="bg-primary hover:bg-primary-hover cursor-pointer w-full p-2 rounded transition text-white disabled:bg-primary/50 disabled:cursor-not-allowed mt-2"
          disabled={!form.email || !form.password}
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          <Link href="/register" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}