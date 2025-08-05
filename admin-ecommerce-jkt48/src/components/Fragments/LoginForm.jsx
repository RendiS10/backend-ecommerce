import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Elements/Input";
import Button from "../../components/Elements/Button";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      if (!data.user || data.user.role !== "admin") {
        setError("Hanya admin yang dapat login.");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Input
        type="text"
        name="email"
        placeholder="Email or Phone Number"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <div className="flex items-center justify-between mt-2">
        <Button type="submit">Log In</Button>
      </div>
    </form>
  );
}

export default LoginForm;
