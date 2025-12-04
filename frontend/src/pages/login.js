import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from '../context/cart-context';

export default function Login() {
  const navigate = useNavigate();
  const { updateToken } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("username", formData.email);
      formBody.append("password", formData.password);

      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!res.ok) throw new Error("Sai email hoặc mật khẩu");

      const data = await res.json();

      // Lưu token và role
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role_id", data.role_id);
      updateToken(data.access_token);

      const redirectAfterLogin = localStorage.getItem("post_login_redirect");

      // Redirect theo role hoặc redirectAfterLogin
      if (data.role_id === 1) {
        navigate("/admin/dashboard"); // client-side routing
      } else if (redirectAfterLogin) {
        localStorage.removeItem("post_login_redirect");
        navigate(redirectAfterLogin);
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoPRMiMRYZ0Rf-LKBOAneZPGJiYOlGpd3TO4XJtLEBNYpEJ88jxGgvo4bYwoA-nS0KCYEMaJl54_bKSGwW5QnlmRYSRb70j-OVwaTeHChoPXsw73aBAHeJpXL3vamOe7IfOkAcJmSRN99EjGT5Qw5lNuCaXkgEMNHXzYCFAPdcaDeVEDOw91v9Jr-cjvD_N2w2M3gJCJEgye4sVhosZDEzM7vOasgOgAXmS3jlPUTuAJhCyV9VTcPh4nZnLGRlBPNzqqWAlIyxQvs')",
      }}
    >
      <div className="absolute inset-0 bg-background-light/70 dark:bg-background-dark/80 backdrop-blur-sm"></div>

      <div className="relative m-4 w-full max-w-md flex flex-col items-center justify-center rounded-xl bg-white/80 dark:bg-background-dark/80 p-8 shadow-2xl backdrop-blur-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M3.75 13.5l-1.148 1.148a.75.75 0 001.06 1.06l1.148-1.148M16.5 6.75l-1.148 1.148a.75.75 0 101.06 1.06l1.148-1.148M6.75 19.5l-1.148 1.148a.75.75 0 001.06 1.06l1.148-1.148M16.5 13.5l1.148 1.148a.75.75 0 01-1.06 1.06l-1.148-1.148M10.5 1.5a.75.75 0 00-.75.75v19.5a.75.75 0 001.5 0V2.25a.75.75 0 00-.75-.75z"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <p className="text-3xl font-black text-slate-800 dark:text-white">
            Chào mừng!
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Tạo tài khoản cho riêng bạn
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <label className="flex flex-col w-full">
            <p className="pb-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              Email
            </p>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="form-input flex h-12 w-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/50 p-3 text-base text-slate-800 dark:text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-l-lg"
                required
              />
              <div className="flex items-center justify-center bg-white/70 dark:bg-slate-800/50 px-3 rounded-r-lg text-slate-500">
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
              </div>
            </div>
          </label>

          <label className="flex flex-col w-full">
            <p className="pb-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              Password
            </p>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="form-input flex h-12 w-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/50 p-3 text-base text-slate-800 dark:text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-l-lg"
                required
              />
              <div className="flex items-center justify-center bg-white/70 dark:bg-slate-800/50 px-3 rounded-r-lg text-slate-500">
                <span className="material-symbols-outlined text-xl">
                  visibility
                </span>
              </div>
            </div>
          </label>

          <span
            className="text-sm font-medium text-primary hover:underline text-right mt-1"
          >
            Quên mật khẩu?
          </span>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-bold text-white shadow-md transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 mt-4"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Chưa có tài khoản?{" "}
            <span onClick={() => navigate('/registration')} className="font-bold text-primary hover:underline">
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
