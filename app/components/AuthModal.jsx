"use client";

import { useState, useCallback } from "react";
import { Eye, EyeOff, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "@/app/components/toast/ToastContext";

export default function AuthModal({
  modalOpen,
  setModalOpen,
  isRegister,
  setIsRegister,
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // HELPER: Cleaner way to update form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing again
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    });
    setFormErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (isRegister) {
      if (!formData.name.trim()) errors.name = "Name required";
      if (!/^\d{10}$/.test(formData.phone)) errors.phone = "10-digit phone required";
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords mismatch";
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email";
    if (formData.password.length < 6) errors.password = "Min 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isRegister]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Welcome Back!", "success");
      setModalOpen(false);
      resetForm();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await res.json();
      if (result.exists) {
        setFormErrors((prev) => ({ ...prev, email: "Email already exists" }));
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (error) throw error;

      showToast("Account created! Please verify your email.", "success");
      setModalOpen(false);
      resetForm();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-10 relative shadow-2xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-black uppercase tracking-tight">
                {isRegister ? "Create" : "Welcome"}{" "}
                <span className="text-red-500 italic">Account</span>
              </h2>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">
                Blinkmaid Authentication
              </p>
            </div>

            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {formErrors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">{formErrors.name}</p>}
                  </div>

                  <div>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {formErrors.phone && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">{formErrors.phone}</p>}
                  </div>
                </>
              )}

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                />
                {formErrors.email && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">{formErrors.email}</p>}
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formErrors.password && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">{formErrors.password}</p>}
              </div>

              {isRegister && (
                <div>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    {isRegister ? "Register" : "Login"} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setFormErrors({});
              }}
              className="w-full text-center mt-6 text-sm text-gray-500 hover:text-red-500 transition-all font-semibold"
            >
              {isRegister ? "Already have an account? Login" : "Create new account"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}