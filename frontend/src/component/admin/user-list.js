import { useEffect, useState } from "react";

export default function UserList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/users");
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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[25%]">
                                Họ và tên
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">
                                Email
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">
                                SĐT
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">
                                Địa chỉ
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%]">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%] text-right">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {/* Loading */}
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                                    Không có người dùng nào
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!isLoading &&
                            rows.map((user) => (
                                <tr
                                    key={user.user_id}
                                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40"
                                >
                                    {/* Name + avatar */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    user.avatar_url ||
                                                    "https://ui-avatars.com/api/?name=" +
                                                    encodeURIComponent(user.full_name)
                                                }
                                                alt={user.full_name}
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <span className="font-medium text-stone-800 dark:text-stone-100">
                                                {user.full_name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300 truncate">
                                        {user.email}
                                    </td>

                                    {/* Phone */}
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300">
                                        {user.phone || "—"}
                                    </td>

                                    {/* Address */}
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300 truncate">
                                        {user.address || "—"}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {user.is_deleted == 0 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                                Đã khóa
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-blue-600 hover:underline mr-3">
                                            Xem
                                        </button>
                                        <button className="text-sm font-medium text-red-600 hover:underline">
                                            {user.is_deleted == 0 ? "Khóa" : "Mở"}
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