import { useEffect, useState } from "react";

export default function ProductList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/admin/products");
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

    const flatRows = rows.flatMap(product =>
        (product.variants || []).flatMap(variant =>
            (variant.batches && variant.batches.length > 0
                ? variant.batches
                : [{ expiration_date: null, quantity: variant.stock_quantity }]
            ).map(batch => ({
                product_id: product.product_id,
                product_name: product.product_name,
                is_hot: product.is_hot,
                is_deleted: product.is_deleted,
                variant_name: variant.variant_name,
                price: variant.price,
                quantity: batch.quantity,
                expiration_date: batch.expiration_date
            }))
        )
    );

    console.log(flatRows);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1917] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[22%]">Sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[22%]">Biến thể</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[12%]">Giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[10%]">Số lượng</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[12%]">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[8%]">Hot</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase w-[14%]">HSD</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-10 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : flatRows.length > 0 ? (
                            flatRows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30">
                                    <td className="px-6 py-4 font-semibold text-stone-700 dark:text-stone-200">
                                        {row.product_name}
                                    </td>

                                    <td className="px-6 py-4 text-stone-700 dark:text-stone-200">
                                        {row.variant_name}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-stone-800 dark:text-stone-100">
                                        {Number(row.price).toLocaleString("vi-VN")} 
                                    </td>

                                    <td className={`px-6 py-4 font-medium ${row.quantity > 0 ? "text-stone-600" : "text-red-500"}`}>
                                        {row.quantity}
                                    </td>

                                    <td className="px-6 py-4">
                                        {row.is_deleted ? (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                                                Đã ẩn
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                Hiển thị
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {row.is_hot && (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                                HOT
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-stone-600">
                                        {row.expiration_date || "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-stone-400">
                                    Chưa có sản phẩm
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
