import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddSupplier() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        supplier_name: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8000/admin/suppliers/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await res.json(); // 🔥 CHỈ đọc 1 lần

            if (!res.ok) {
                throw new Error(result.message || "Thêm nhà cung cấp thất bại");
            }

            alert(result.message || "Thêm nhà cung cấp thành công");

            // Reset form (UX tốt hơn)
            setFormData({
                supplier_name: "",
                email: "",
                phone: "",
                address: ""
            });

            navigate("/admin/supplier");

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="ml-64 flex flex-row min-h-screen">
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <SideBar />
                    </div>

                    <main className="flex-1 p-8 w-full">
                        <div className="w-full max-w-4xl mx-auto">

                            <div className="flex flex-col gap-1 mb-8">
                                <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                                    Thêm nhà cung cấp
                                </p>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">
                                    Tạo mới đối tác cung ứng hàng hóa cho cửa hàng.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                            </span>
                                            Thông tin đối tác
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex flex-col w-full gap-2 md:col-span-2">
                                                <span className="label-text">Tên nhà cung cấp <span className="text-red-500">*</span></span>
                                                <input
                                                    name="supplier_name"
                                                    value={formData.supplier_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: Công ty TNHH Phân Phối Sữa Việt..."
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Hotline/SĐT</span>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: 0909 123 456"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Email đặt hàng</span>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="orders@supplier.com"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            </span>
                                            Địa chỉ kho/Văn phòng
                                        </h3>

                                        <label className="flex flex-col w-full gap-2">
                                            <span className="label-text">Địa chỉ chi tiết <span className="text-red-500">*</span></span>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                rows="3"
                                                className="min-h-[100px] py-3 w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                placeholder="VD: KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP.HCM..."
                                            />
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="h-11 px-6 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 px-8 rounded-xl bg-amber-900 text-white font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-300 flex items-center gap-2"
                                        >
                                            {isSubmitting ? "Đang lưu..." : "Lưu nhà cung cấp"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
        .input-field {
          @apply w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200;
        }
        .label-text {
          @apply text-stone-700 dark:text-stone-300 text-sm font-semibold;
        }
      `}</style>
        </div>
    );
}