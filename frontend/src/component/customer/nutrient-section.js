export default function NutrientSection({ product }) {
    return (
        <div className="mt-12">
            <h3 className="text-[#333333] dark:text-white text-xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-6">
                Thông tin chi tiết
            </h3>

            <div className="text-[#333333] dark:text-gray-300 space-y-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Xuất xứ</span>
                                <p className="font-medium text-lg text-[#333333] dark:text-white">{product.origin || "Việt Nam"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thành phần</span>
                                <p className="font-medium text-[#333333] dark:text-white text-justify">{product.ingredients || "100% Sữa tươi nguyên chất"}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hướng dẫn sử dụng</span>
                                <p className="text-[#333333] dark:text-white">{product.usage || "Dùng trực tiếp, ngon hơn khi uống lạnh."}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bảo quản</span>
                                <p className="text-[#333333] dark:text-white">{product.storage || "Để nơi khô ráo, thoáng mát."}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-[#333333] dark:text-white text-lg font-bold mb-4">Giá trị dinh dưỡng (trên 100g/ml)</h4>
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            <div>
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-100 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Chỉ số chính</th>
                                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Hàm lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        <tr><td className="p-3 text-sm text-gray-600">Năng lượng</td><td className="p-3 text-sm font-bold text-right">{product.calories || 0} kcal</td></tr>
                                        <tr><td className="p-3 text-sm text-gray-600">Protein</td><td className="p-3 text-sm font-bold text-right">{product.protein || 0} g</td></tr>
                                        <tr><td className="p-3 text-sm text-gray-600">Chất béo</td><td className="p-3 text-sm font-bold text-right">{product.fat || 0} g</td></tr>
                                        <tr><td className="p-3 text-sm text-gray-600">Carbohydrate</td><td className="p-3 text-sm font-bold text-right">{product.carbohydrates || 0} g</td></tr>
                                        <tr><td className="p-3 text-sm text-gray-600">Đường</td><td className="p-3 text-sm font-bold text-right">{product.sugar || 0} g</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-100 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="p-3 font-semibold text-sm text-gray-600">Vitamin & Khoáng chất</th>
                                            <th className="p-3 font-semibold text-sm text-gray-600 text-right">Đáp ứng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {(() => {
                                            try {
                                                const vits = product.vitamins ? JSON.parse(product.vitamins) : {};
                                                const mins = product.minerals ? JSON.parse(product.minerals) : {};
                                                const micros = { ...vits, ...mins };
                                                if (Object.keys(micros).length === 0) return <tr><td colSpan="2" className="p-3 text-sm text-gray-400 italic text-center">Đang cập nhật</td></tr>;
                                                return Object.entries(micros).map(([k, v], i) => (
                                                    <tr key={i}><td className="p-3 text-sm text-gray-600">{k}</td><td className="p-3 text-sm font-bold text-right">{v}</td></tr>
                                                ));
                                            } catch { return <tr><td colSpan="2"></td></tr>; }
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}