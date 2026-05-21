"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    api: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", role: "", api: "" };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

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
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!form.password) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await API.post("/auth/register", form);
      router.push("/login");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        api: error?.response?.data?.message || "Registration failed",
      }));
    }
  };

  const options = [
    { name: "User", value: "User" },
    { name: "Admin", value: "Admin" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-card text-text border border-border p-6 shadow rounded w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {/* Name */}
        <input
          className="border border-border bg-bg p-2 w-full mb-1 rounded outline-none focus:ring-2 focus:ring-primary"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && (
          <p className="text-danger text-sm mb-2">{errors.name}</p>
        )}

        {/* Email */}
        <div className="mt-1">
          <input
            className="border border-border bg-bg p-2 w-full mb-1 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-danger text-sm mb-2">{errors.email}</p>
          )}
        </div>

        {/* Password with Eye Toggle */}
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

        <select
          value={form?.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border border-border bg-bg p-2 w-full rounded outline-none focus:ring-2 focus:ring-primary mt-1"
        >
          <option value="">Choose a role</option>
          {options.map((option, index) => (
            <option key={index} value={option?.value}>
              {option?.name}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-danger text-sm mb-2">{errors.role}</p>
        )}

        {/* API Error */}
        {errors.api && (
          <p className="text-danger text-sm mb-3 text-center">{errors.api}</p>
        )}

        {/* API Error */}
        {errors.api && (
          <p className="text-danger text-sm mb-3 text-center">{errors.api}</p>
        )}

        <button
          onClick={handleRegister}
          className="bg-primary hover:bg-primary-hover text-white w-full p-2 rounded transition mt-2 cursor-pointer"
        >
          Register
        </button>
      </div>
    </div>
  );
}
