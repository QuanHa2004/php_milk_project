import { useState, useEffect } from "react";

export default function Voucher() {
    const [rows, setRows] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const token = localStorage.getItem("access_token");

                const res = await fetch("http://localhost:8000/promotions", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Không thể tải voucher");
                }

                const json = await res.json();

                setRows(Array.isArray(json.data) ? json.data : []);
            } catch (err) {
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    if (isLoading) {
        return <p className="text-sm text-gray-500">Đang tải voucher...</p>;
    }

    if (!rows.length) {
        return <p className="text-sm text-gray-500 italic">Không có voucher khả dụng</p>;
    }

    return (
        <div className="space-y-4">
            {rows.map((voucher) => {
                const isPercent = voucher.discount_type === "percent";

                return (
                    <label
                        key={voucher.promo_id}
                        className={`relative flex gap-4 p-4 rounded-xl border cursor-pointer transition-all
                        ${selectedVoucher?.promo_id === voucher.promo_id
                                ? "border-primary bg-blue-50 ring-2 ring-primary"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        <input
                            type="radio"
                            checked={selectedVoucher?.promo_id === voucher.promo_id}
                            onChange={() => setSelectedVoucher(voucher)}
                            className="absolute top-4 right-4 h-5 w-5 accent-primary"
                        />

                        <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-primary text-white font-bold text-lg">
                            {isPercent ? `${parseInt(voucher.discount_value)}%` : `${Number(voucher.discount_value).toLocaleString()}đ`}
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold text-gray-900 text-base">
                                {voucher.promo_code}
                            </p>

                            <p className="text-sm text-gray-600">
                                {voucher.description}
                            </p>

                            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                <p>
                                    Đơn tối thiểu:{" "}
                                    <span className="font-medium">
                                        {Number(voucher.min_order_value).toLocaleString()}đ
                                    </span>
                                </p>

                                {voucher.max_discount_value && (
                                    <p>
                                        Giảm tối đa:{" "}
                                        <span className="font-medium">
                                            {Number(voucher.max_discount_value).toLocaleString()}đ
                                        </span>
                                    </p>
                                )}

                                <p>
                                    HSD:{" "}
                                    {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
