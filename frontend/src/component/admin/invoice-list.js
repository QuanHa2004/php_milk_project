import { useEffect, useState } from "react";

export default function InvoiceList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/invoices");
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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">
                                Mã phiếu
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[35%]">
                                Nhà cung cấp
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[25%]">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">
                                Ngày nhập
                            </th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">

                        {/* Loading */}
                        {isLoading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-stone-400">
                                    Chưa có phiếu nhập hàng nào.
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!isLoading &&
                            rows.map((invoice) => (
                                <tr
                                    key={invoice.invoice_id}
                                    className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors"
                                >
                                    {/* Invoice ID */}
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                                            #{invoice.invoice_id}
                                        </span>
                                    </td>

                                    {/* Supplier */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-stone-700 dark:text-stone-200">
                                            {invoice.supplier_name}
                                        </span>
                                    </td>

                                    {/* Total */}
                                    <td className="px-6 py-4 text-sm font-bold text-stone-800 dark:text-stone-100">
                                        {Number(invoice.total_amount).toLocaleString("vi-VN")} 
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">
                                        {new Date(invoice.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
