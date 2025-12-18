import { useEffect, useState } from "react";

const statusMap = {
    pending: { label: "Chờ xử lý", cls: "bg-stone-100 text-stone-700 border-stone-200" },
    processing: { label: "Đang xử lý", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    shipping: { label: "Đang giao", cls: "bg-blue-100 text-blue-800 border-blue-200" },
    delivered: { label: "Hoàn thành", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    cancelled: { label: "Đã hủy", cls: "bg-red-100 text-red-700 border-red-200" }
};

export default function OrderList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/orders");
                if (!res.ok) throw new Error();
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
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[12%]">Mã đơn</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Khách hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[16%]">Ngày đặt</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[14%]">Tổng tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[18%]">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%]">Thanh toán</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%] text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(item => {
                                const status = statusMap[item.status] || statusMap.pending;
                                return (
                                    <tr
                                        key={item.order_id}
                                        className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono font-semibold text-stone-700 dark:text-stone-200">
                                            #{item.order_id}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-stone-700 dark:text-stone-200">
                                                    {item.full_name}
                                                </span>
                                                <span className="text-xs text-stone-400">
                                                    {item.phone}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300">
                                            {new Date(item.order_date).toLocaleString("vi-VN")}
                                        </td>

                                        <td className="px-6 py-4 font-bold text-stone-800 dark:text-stone-100">
                                            {Number(item.total_amount).toLocaleString("vi-VN")} ₫
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status.cls}`}>
                                                {status.label}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.is_paid ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    Đã thanh toán
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                                    Chưa thanh toán
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline">
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-stone-400">
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
