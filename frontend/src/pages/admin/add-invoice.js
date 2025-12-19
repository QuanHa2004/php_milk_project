import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

const createNewItem = (id) => ({
    id: id, 
    product_id: "",
    variant_id: "",
    quantity: "",
    price: "", 
    expiration_date: "",
    manufacturing_date: "", 
    error: ""
});

export default function AddInvoice() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState([]); 
    const [suppliers, setSuppliers] = useState([]);
    const [lastItemId, setLastItemId] = useState(0); 

    const [formData, setFormData] = useState({
        supplier_id: "", 
        note: ""
    });

    const [invoiceItems, setInvoiceItems] = useState([createNewItem(1)]);

    const fetchList = useCallback(async (url, setter) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setter(data.data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            setter([]);
        }
    }, []);

    useEffect(() => {
        fetchList("http://localhost:8000/admin/products?include_variants=true", setProducts);
        fetchList("http://localhost:8000/admin/suppliers", setSuppliers);
    }, [fetchList]);

    const handleInvoiceChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddItem = () => {
        setLastItemId(prev => prev + 1);
        setInvoiceItems(prev => [...prev, createNewItem(lastItemId + 1)]);
    };

    const handleRemoveItem = (id) => {
        if (invoiceItems.length > 1) {
            setInvoiceItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id, name, value) => {
        setInvoiceItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                let newItem = { ...item, [name]: value };

                if (name === 'product_id') {
                    newItem.variant_id = "";
                }

                if (name === 'quantity' || name === 'price') {
                    const numberValue = Math.max(0, parseInt(value) || 0);
                    newItem[name] = numberValue;
                }

                return newItem;
            }
            return item;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const total_amount = invoiceItems.reduce((sum, item) =>
            sum + (parseFloat(item.quantity) * parseFloat(item.price)), 0
        );

        const payload = {
            supplier_id: formData.supplier_id,
            note: formData.note,
            total_amount: total_amount,
            items: invoiceItems.map(item => ({
                variant_id: item.variant_id,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                expiration_date: item.expiration_date,
                manufacturing_date: item.manufacturing_date,
            }))
        };

        if (!payload.supplier_id || payload.items.some(item =>
            !item.variant_id || item.quantity <= 0 || item.price <= 0 || !item.expiration_date
        )) {
            alert("Vui lòng điền đầy đủ và chính xác thông tin bắt buộc (Nhà cung cấp, Sản phẩm, Biến thể, Số lượng, Giá nhập, HSD).");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/admin/invoices/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate("/admin/invoice");
            } else {
                const errorData = await res.json();
                alert(`Lỗi khi tạo phiếu nhập: ${errorData.error || res.statusText}`);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getVariantsByProductId = (productId) => {
        const product = products.find(p => p.product_id === parseInt(productId));
        return product?.variants || [];
    };

    return (
        <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="ml-64 flex flex-row min-h-screen">
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <SideBar />
                    </div>

                    <main className="flex-1 p-8 w-full">
                        <div className="w-full max-w-6xl mx-auto">

                            <div className="flex flex-col gap-1 mb-8">
                                <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                                    Tạo phiếu nhập hàng 
                                </p>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">
                                    Nhập kho sản phẩm, ghi nhận lô hàng và giá vốn.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    <div>
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path><path d="M19 21v-8l-6 -4l-6 4v8"></path></svg>
                                            </span>
                                            Thông tin chung
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Nhà cung cấp <span className="text-red-500">*</span></span>
                                                <select
                                                    name="supplier_id"
                                                    value={formData.supplier_id}
                                                    onChange={handleInvoiceChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                >
                                                    <option value="" disabled>-- Chọn nhà cung cấp --</option>
                                                    {suppliers.map(s => (
                                                        <option key={s.supplier_id} value={s.supplier_id}>
                                                            {s.supplier_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="label-text">Ghi chú chung</span>
                                                <input
                                                    name="note"
                                                    type="text"
                                                    value={formData.note}
                                                    onChange={handleInvoiceChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                    placeholder="VD: Hóa đơn thanh toán công nợ tháng trước"
                                                />
                                            </label>

                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                            </span>
                                            Chi tiết các mặt hàng nhập
                                        </h3>

                                        {invoiceItems.map((item, index) => (
                                            <div key={item.id} className="border border-stone-200 dark:border-stone-700 rounded-lg p-6 mb-4 relative">
                                                <p className="font-bold text-stone-600 dark:text-stone-300 mb-4">Mặt hàng #{index + 1}</p>

                                                {invoiceItems.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                                        title="Xóa dòng này"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                                    <label className="flex flex-col w-full gap-2 md:col-span-2">
                                                        <span className="label-text">Sản phẩm <span className="text-red-500">*</span></span>
                                                        <select
                                                            value={item.product_id}
                                                            onChange={(e) => handleItemChange(item.id, 'product_id', e.target.value)}
                                                            required
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                        >
                                                            <option value="" disabled>-- Chọn sản phẩm --</option>
                                                            {products.map(p => (
                                                                <option key={p.product_id} value={p.product_id}>
                                                                    {p.product_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>

                                                    <label className="flex flex-col w-full gap-2 md:col-span-2">
                                                        <span className="label-text">Biến thể (Quy cách) <span className="text-red-500">*</span></span>
                                                        <select
                                                            value={item.variant_id}
                                                            onChange={(e) => handleItemChange(item.id, 'variant_id', e.target.value)}
                                                            required
                                                            disabled={!item.product_id}
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                        >
                                                            <option value="" disabled>-- Chọn biến thể --</option>
                                                            {getVariantsByProductId(item.product_id).map(v => (
                                                                <option key={v.variant_id} value={v.variant_id}>
                                                                    {v.variant_name || `${v.packaging_type} ${v.volume}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>

                                                    <label className="flex flex-col w-full gap-2">
                                                        <span className="label-text">Số lượng nhập <span className="text-red-500">*</span></span>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                            required
                                                            min="1"
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                            placeholder="0"
                                                        />
                                                    </label>

                                                    <label className="flex flex-col w-full gap-2">
                                                        <span className="label-text">Giá nhập/đơn vị (VNĐ) <span className="text-red-500">*</span></span>
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                                                            required
                                                            min="1"
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                            placeholder="0"
                                                        />
                                                    </label>

                                                    <label className="flex flex-col w-full gap-2">
                                                        <span className="label-text">Hạn sử dụng (Lô hàng) <span className="text-red-500">*</span></span>
                                                        <input
                                                            type="date"
                                                            value={item.expiration_date}
                                                            onChange={(e) => handleItemChange(item.id, 'expiration_date', e.target.value)}
                                                            required
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                        />
                                                    </label>

                                                    <label className="flex flex-col w-full gap-2">
                                                        <span className="label-text">Ngày sản xuất (Tùy chọn)</span>
                                                        <input
                                                            type="date"
                                                            value={item.manufacturing_date}
                                                            onChange={(e) => handleItemChange(item.id, 'manufacturing_date', e.target.value)}
                                                            className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                                                        />
                                                    </label>

                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="h-10 px-4 rounded-xl border border-amber-500 text-amber-600 font-medium hover:bg-amber-50 transition-colors mt-2 flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            Thêm mặt hàng
                                        </button>
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