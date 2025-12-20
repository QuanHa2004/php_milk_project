import { useEffect, useState } from "react";

export default function ManufacturerList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/manufacturers");
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
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[30%]">Nhà sản xuất</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[30%]">Liên hệ</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[40%]">Địa chỉ</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(item => (
                                <tr
                                    key={item.manufacturer_id}
                                    className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-stone-700 dark:text-stone-200">
                                                {item.manufacturer_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <span className="text-stone-600 dark:text-stone-300 font-mono">
                                                {item.phone || "--"}
                                            </span>
                                            <span
                                                className="text-stone-500 dark:text-stone-400 truncate max-w-[220px]"
                                                title={item.email}
                                            >
                                                {item.email || "--"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p
                                            className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2"
                                            title={item.address}
                                        >
                                            {item.address || "--"}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-stone-400">
                                    Chưa có nhà sản xuất nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
