import { useEffect, useState } from "react";

export default function PromotionList() {
    const [promotionList, setPromotionList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/promotions");

                if (!res.ok) {
                    throw new Error("Lỗi kết nối server");
                }

                const data = await res.json();

                // kiem tra du lieu tra ve co phai mang hay khong 
                if (Array.isArray(data)) {
                    setPromotionList(data);
                } else {
                    setPromotionList([]);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setPromotionList([]);
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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[20%]">Mã giảm giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">Giá trị giảm</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">Đơn tối thiểu</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[20%]">Thời hạn</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%] text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : promotionList.length > 0 ? (
                            promotionList.map((promotion, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 select-all">
                                                {promotion.promo_code}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {promotion.discount_type === "percent" ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-stone-700 dark:text-stone-200">
                                                    {Number(promotion.discount_value)}%
                                                </span>
                                                <span className="text-xs text-stone-400 ml-1">(Tối đa {Number(promotion.max_discount_value).toLocaleString('vi-VN')})</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                                    {Number(promotion.discount_value).toLocaleString('vi-VN')}
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                            {Number(promotion.min_order_value).toLocaleString('vi-VN')}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs text-stone-500 dark:text-stone-400">
                                            <div className="flex items-center gap-1">
                                                <span className="w-10">Bắt đầu:</span>
                                                <span>{new Date(promotion.start_date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-stone-800 dark:text-stone-200 font-medium mt-0.5">
                                                <span className="w-10">Kết thúc:</span>
                                                <span>{new Date(promotion.end_date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {promotion.is_active ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-stone-100 text-stone-500 border-stone-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                                                Đã ngưng
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline transition-colors">
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-stone-400">
                                        <p className="text-sm font-medium">Chưa có chương trình khuyến mãi nào.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}