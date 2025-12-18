import { useEffect, useState } from "react";

export default function ReviewList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/reviews");
                if (!res.ok) throw new Error("Server error");
                const json = await res.json();
                setRows(Array.isArray(json.data) ? json.data : []);
            } catch {
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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Người dùng</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">Biến thể</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">Đánh giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Bình luận</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%] text-right">Hành động</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-stone-500">
                                    Không có đánh giá nào
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((row) => (
                                <tr key={row.review_id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                                    <td className="px-6 py-4 font-medium text-stone-800 dark:text-stone-100">
                                        {row.full_name}
                                    </td>

                                    <td className="px-6 py-4 text-stone-700 dark:text-stone-300">
                                        {row.product_name}
                                    </td>

                                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400">
                                        {row.variant_name}
                                    </td>

                                    <td className="px-6 py-4">
                                        <RatingStars value={row.rating || 0} />
                                    </td>

                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                                        {row.comment || "—"}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                                            Ẩn
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



function RatingStars({ value }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= value ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 ${star <= value ? "text-yellow-400" : "text-stone-300"}`}
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}
