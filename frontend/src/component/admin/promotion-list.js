import { useEffect, useState } from "react";

export default function PromotionList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%] text-right">Hành động</th>
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
                                                    (tối đa {Number(promotion.max_discount_value).toLocaleString("vi-VN")}₫)
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                                {Number(promotion.discount_value).toLocaleString("vi-VN")}₫
                                            </div>
                                        )}
                                    </td>

                                    {/* Min order */}
                                    <td className="px-6 py-4 text-sm font-bold text-stone-800 dark:text-stone-100">
                                        {Number(promotion.min_order_value).toLocaleString("vi-VN")}₫
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
                                        {promotion.is_active ? (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500">
                                                Đã ngưng
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-amber-700 hover:underline">
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
