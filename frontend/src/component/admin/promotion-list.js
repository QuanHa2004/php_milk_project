import { useEffect, useState } from "react";

export default function PromotionList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/promotions");
                if (!res.ok) throw new Error("Server error");
                const json = await res.json();
                setRows(Array.isArray(json.data) ? json.data : []);
            } catch (e) {
                console.error(e);
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const openConfirm = (promotion) => {
        setSelectedPromo(promotion);
        setConfirmOpen(true);
    };

    const confirmToggle = async () => {
        if (!selectedPromo) return;

        const newStatus = selectedPromo.is_active ? 0 : 1;

        try {
            const res = await fetch("http://localhost:8000/admin/promotions/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    promo_id: selectedPromo.promo_id,
                    is_active: newStatus
                })
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Cập nhật thất bại");
            }

            setRows(prev =>
                prev.map(p =>
                    p.promo_id === selectedPromo.promo_id
                        ? { ...p, is_active: newStatus }
                        : p
                )
            );

        } catch (err) {
            alert("Không thể cập nhật trạng thái mã giảm giá");
        } finally {
            setConfirmOpen(false);
            setSelectedPromo(null);
        }
    };


    return (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1917] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">

                    {/* HEADER */}
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Mã giảm giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">Giá trị giảm</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">Đơn tối thiểu</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Thời hạn</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">Trạng thái</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {/* Loading */}
                        {isLoading && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                                    Chưa có chương trình khuyến mãi nào.
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!isLoading &&
                            rows.map((promotion) => (
                                <tr
                                    key={promotion.promo_id}
                                    className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors"
                                >
                                    {/* Promo code */}
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 select-all">
                                            {promotion.promo_code}
                                        </span>
                                    </td>

                                    {/* Discount */}
                                    <td className="px-6 py-4">
                                        {promotion.discount_type === "percent" ? (
                                            <div className="text-sm font-bold text-stone-700 dark:text-stone-200">
                                                {Number(promotion.discount_value)}%
                                                <span className="ml-1 text-xs text-stone-400">
                                                    (tối đa {Number(promotion.max_discount_value).toLocaleString("vi-VN")})
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                                {Number(promotion.discount_value).toLocaleString("vi-VN")}
                                            </div>
                                        )}
                                    </td>

                                    {/* Min order */}
                                    <td className="px-6 py-4 text-sm font-bold text-stone-800 dark:text-stone-100">
                                        {Number(promotion.min_order_value).toLocaleString("vi-VN")}
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-xs text-stone-500 dark:text-stone-400">
                                        <div>BĐ: {new Date(promotion.start_date).toLocaleDateString("vi-VN")}</div>
                                        <div className="font-medium text-stone-800 dark:text-stone-200">
                                            KT: {new Date(promotion.end_date).toLocaleDateString("vi-VN")}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openConfirm(promotion)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full border transition
                                                ${promotion.is_active
                                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                                    : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                                                }`}
                                        >
                                            {promotion.is_active ? "Hoạt động" : "Đã ngưng"}
                                        </button>

                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {confirmOpen && selectedPromo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-[#1C1917] rounded-2xl w-[420px] shadow-lg p-6">

                        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                            Xác nhận thay đổi trạng thái
                        </h3>

                        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                            Bạn có chắc chắn muốn{" "}
                            <span className="text-sm text-stone-600 dark:text-stone-400">
                                {selectedPromo.is_active ? "ngưng" : "kích hoạt"}
                            </span>{" "}
                            mã giảm giá{" "}
                            <span className="font-mono font-bold text-amber-600">
                                {selectedPromo.promo_code}
                            </span>
                            ?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={confirmToggle}
                                className={`px-4 py-2 rounded-lg text-white font-semibold
                        ${selectedPromo.is_active
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
