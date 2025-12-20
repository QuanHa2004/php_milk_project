import { useEffect, useState } from "react";

export default function UserList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/users");
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

    const openConfirm = (user) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const confirmToggle = async () => {
        if (!selectedUser) return;

        const newStatus = selectedUser.is_active ? 0 : 1;

        try {
            const res = await fetch("http://localhost:8000/admin/users/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: selectedUser.user_id,
                    is_deleted: newStatus
                })
            });

            const json = await res.json();
            if (!res.ok || !json.success) throw new Error();

            setRows(prev =>
                prev.map(u =>
                    u.user_id === selectedUser.user_id
                        ? { ...u, is_deleted: newStatus }
                        : u
                )
            );
        } catch {
            alert("Không thể cập nhật trạng thái người dùng");
        } finally {
            setConfirmOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1917] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[25%]">Họ và tên</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[15%]">SĐT</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[20%]">Địa chỉ</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%]">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                                    Không có người dùng nào
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((user) => (
                                <tr
                                    key={user.user_id}
                                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer"
                                    onClick={() => openConfirm(user)}
                                >
                                    <td className="px-6 py-4 font-medium text-stone-800 dark:text-stone-100">
                                        {user.full_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300 truncate">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300">
                                        {user.phone || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300 truncate">
                                        {user.address || "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_active ? (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                                                Đã khóa
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-stone-900 rounded-xl p-6 w-[360px]">
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-4">
                            Xác nhận thay đổi
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
                            Bạn có chắc muốn {selectedUser?.is_active ? "khóa" : "mở khóa"} người dùng này?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border text-stone-600"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmToggle}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
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
