import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NewInvoice() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        supplier_name: "",
        product_name: "", 
        quantity: "",
        import_price: "",
        expiration_date: "",
        note: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("http://localhost:8000/admin/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate("/admin/invoice");
            } else {
                alert("Lỗi khi tạo phiếu nhập!");
            }
        } catch (error) {
            console.error("Error:", error);
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
                                    Tạo phiếu nhập hàng
                                </p>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">
                                    Nhập kho sản phẩm và ghi nhận công nợ nhà cung cấp.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    <div>
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path><path d="M19 21v-8l-6 -4l-6 4v8"></path></svg>
                                            </span>
                                            Thông tin nguồn hàng
                                        </h3>

                                        <div className="grid grid-cols-1 gap-6">
                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Nhà cung cấp <span className="text-red-500">*</span></span>
                                                <input
                                                    name="supplier_name"
                                                    value={formData.supplier_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: Công ty CP Vinamilk..."
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                            </span>
                                            Chi tiết lô hàng
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            <label className="flex flex-col w-full gap-2 md:col-span-2">
                                                <span className="label-text">Tên sản phẩm <span className="text-red-500">*</span></span>
                                                <input
                                                    name="product_name"
                                                    value={formData.product_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: Sữa tươi tiệt trùng 1L"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Số lượng nhập <span className="text-red-500">*</span></span>
                                                <input
                                                    name="quantity"
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="0"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Giá nhập (VNĐ) <span className="text-red-500">*</span></span>
                                                <input
                                                    name="import_price"
                                                    type="number"
                                                    value={formData.import_price}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="0"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Hạn sử dụng (Lô hàng)</span>
                                                <input
                                                    name="expiration_date"
                                                    type="date"
                                                    value={formData.expiration_date}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Ghi chú thêm</span>
                                                <input
                                                    name="note"
                                                    value={formData.note}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: Hàng tặng kèm..."
                                                />
                                            </label>

                                        </div>
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
                                            {isSubmitting ? "Đang xử lý..." : "Xác nhận nhập hàng"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
        .w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 {
          @apply w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200;
        }
        .label-text {
          @apply text-stone-700 dark:text-stone-300 text-sm font-semibold;
        }
      `}</style>
        </div>
    );
}