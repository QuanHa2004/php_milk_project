import { useState } from "react";

const availableVouchers = [
  { id: 1, code: "DISCOUNT10", description: "Giảm 10% cho đơn từ 200K" },
  { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển" },
  { id: 3, code: "MEMBER5", description: "Giảm 5% cho thành viên" },
];

export default function Voucher() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  return (
    <div className="space-y-3">
      {availableVouchers.map((voucher) => (
        <label
          key={voucher.id}
          className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <input
            type="checkbox"
            checked={selectedVoucher?.id === voucher.id}
            onChange={() =>
              setSelectedVoucher(
                selectedVoucher?.id === voucher.id ? null : voucher
              )
            }
            className="w-5 h-5 mt-[3px] accent-[#8b4513] cursor-pointer"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white text-base">
              {voucher.code}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {voucher.description}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}
