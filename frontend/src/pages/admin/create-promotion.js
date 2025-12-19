import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreatePromotion() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        promo_code: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        max_discount_value: "",
        min_order_value: "",
        max_uses: "",       
        start_date: "",
        end_date: "",
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
            navigate("/login");
            return;
        }

        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            alert("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            min_order_value: parseFloat(formData.min_order_value),
            max_discount_value: formData.discount_type === 'percent'
                ? parseFloat(formData.max_discount_value)
                : parseFloat(formData.discount_value),

            max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            is_active: formData.is_active ? 1 : 0,
            start_date: formData.start_date.replace('T', ' ') + ':00',
            end_date: formData.end_date.replace('T', ' ') + ':00',
        };

        try {
            const response = await fetch("http://localhost:8000/admin/promotions/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Tạo mã giảm giá thành công! 🎉");
                navigate("/admin/promotion");
            } else {
                if (response.status === 401) {
                    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    localStorage.removeItem('token'); 
                    navigate("/login");
                } else {
                    alert(result.error || "Tạo mã thất bại!");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Lỗi kết nối đến máy chủ.");
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
                                    Tạo mã giảm giá 
                                </p>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">
                                    Thiết lập các chương trình khuyến mãi mới cho cửa hàng.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    <div>
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                            </span>
                                            Thông tin mã giảm
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Mã giảm giá <span className="text-red-500">*</span></span>
                                                <input
                                                    name="promo_code"
                                                    value={formData.promo_code}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500 font-mono uppercase tracking-wide"
                                                    placeholder="VD: SALE50"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Mô tả ngắn</span>
                                                <input
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                    placeholder="VD: Giảm giá chào hè..."
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Loại giảm giá</span>
                                                <select
                                                    name="discount_type"
                                                    value={formData.discount_type}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                >
                                                    <option value="percent">Phần trăm (%)</option>
                                                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                                                </select>
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">
                                                    {formData.discount_type === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'} <span className="text-red-500">*</span>
                                                </span>
                                                <input
                                                    name="discount_value"
                                                    type="number"
                                                    value={formData.discount_value}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                    placeholder={formData.discount_type === 'percent' ? "VD: 10, 20..." : "VD: 50000..."}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20M2 12h20"></path></svg>
                                            </span>
                                            Điều kiện áp dụng
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {formData.discount_type === 'percent' && (
                                                <label className="flex flex-col w-full gap-2">
                                                    <span className="label-text">Giảm tối đa (VNĐ) <span className="text-red-500">*</span></span>
                                                    <input
                                                        name="max_discount_value"
                                                        type="number"
                                                        value={formData.max_discount_value}
                                                        onChange={handleChange}
                                                        required
                                                        min="0"
                                                        className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                        placeholder="VD: 100000"
                                                    />
                                                </label>
                                            )}

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Đơn tối thiểu (VNĐ) <span className="text-red-500">*</span></span>
                                                <input
                                                    name="min_order_value"
                                                    type="number"
                                                    value={formData.min_order_value}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                    placeholder="VD: 200000"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Giới hạn số lượt dùng (Để trống = Vô hạn)</span>
                                                <input
                                                    name="max_uses"
                                                    type="number"
                                                    value={formData.max_uses}
                                                    onChange={handleChange}
                                                    min="1"
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                    placeholder="VD: 100"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            Thời gian & Trạng thái
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Ngày bắt đầu <span className="text-red-500">*</span></span>
                                                <input
                                                    name="start_date"
                                                    type="datetime-local"
                                                    value={formData.start_date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                />
                                            </label>
                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Ngày kết thúc <span className="text-red-500">*</span></span>
                                                <input
                                                    name="end_date"
                                                    type="datetime-local"
                                                    value={formData.end_date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white focus:outline-none focus:border-amber-500"
                                                />
                                            </label>
                                        </div>

                                        <div className="mt-6 flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                name="is_active"
                                                checked={formData.is_active}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                            />
                                            <label htmlFor="is_active" className="text-stone-700 dark:text-stone-300 font-medium cursor-pointer select-none">
                                                Kích hoạt ngay sau khi tạo
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                                        <button type="button" onClick={() => navigate(-1)} className="h-11 px-6 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors">
                                            Hủy bỏ
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-amber-900 text-white font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-300">
                                            {isSubmitting ? "Đang xử lý..." : "Tạo mã giảm giá"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <style>{`
                .label-text { @apply text-stone-700 dark:text-stone-300 text-sm font-semibold; }
            `}</style>
        </div>
    );
}