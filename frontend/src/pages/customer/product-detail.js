import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import Header from "../../component/customer/header";
import Footer from "../../component/customer/footer";
import useCart from "../../context/cart-context";

export default function ProductDetail() {
    const { product_id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // State lưu lựa chọn của người dùng
    const [selectedVolume, setSelectedVolume] = useState(null);
    const [selectedPack, setSelectedPack] = useState(null);

    /* ===========================
       1. FETCH DATA
    ============================ */
    useEffect(() => {
        fetch(`http://localhost:8000/products/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);

                // Mặc định chọn biến thể đầu tiên khi load trang
                if (data.variants && data.variants.length > 0) {
                    const firstVariant = data.variants[0];
                    setSelectedVolume(firstVariant.volume);
                    setSelectedPack(firstVariant.packaging_type);
                }
            })
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, [product_id]);

    /* ===========================
       2. LOGIC TÍNH TOÁN DYNAMIC
    ============================ */

    // A. Lấy danh sách các Dung tích (Volume) duy nhất từ variants
    // Kết quả VD: ["180ml", "110ml"]
    const uniqueVolumes = useMemo(() => {
        if (!product?.variants) return [];
        return [...new Set(product.variants.map(v => v.volume))];
    }, [product]);

    // B. Lấy danh sách Quy cách (Packaging) KHẢ DỤNG dựa trên Dung tích đang chọn
    // Nếu chọn "180ml", chỉ hiện các loại gói của 180ml (Thùng, Lốc)
    const availablePacks = useMemo(() => {
        if (!product?.variants || !selectedVolume) return [];
        return product.variants
            .filter(v => v.volume === selectedVolume)
            .map(v => v.packaging_type);
    }, [product, selectedVolume]);

    // C. Tìm ra Biến thể cụ thể (Variant Object) khớp với cả 2 lựa chọn
    const currentVariant = useMemo(() => {
        if (!product?.variants) return null;
        return product.variants.find(
            v => v.volume === selectedVolume && v.packaging_type === selectedPack
        );
    }, [product, selectedVolume, selectedPack]);

    /* ===========================
       3. HANDLERS
    ============================ */

    // Xử lý khi đổi Dung tích
    const handleVolumeChange = (newVolume) => {
        setSelectedVolume(newVolume);

        // Logic thông minh: Khi đổi dung tích, phải kiểm tra xem quy cách cũ có hợp lệ ko?
        // Nếu không hợp lệ (VD: Đang chọn Lon, đổi sang size hộp giấy), 
        // thì tự động chọn quy cách đầu tiên của dung tích mới.
        const variantsOfNewVolume = product.variants.filter(v => v.volume === newVolume);
        const hasCurrentPack = variantsOfNewVolume.some(v => v.packaging_type === selectedPack);

        if (!hasCurrentPack && variantsOfNewVolume.length > 0) {
            setSelectedPack(variantsOfNewVolume[0].packaging_type);
        }
    };

    const handleAdd = async (e) => {
        e.stopPropagation();

        console.log("Current Variant:", currentVariant);

        if (
            !currentVariant ||
            currentVariant.stock_quantity <= 0 ||
            !currentVariant.batch_id ||
            currentVariant.batch_quantity <= 0
        ) {
            alert("Sản phẩm tạm hết hàng hoặc không còn lô hàng khả dụng!");
            return;
        }

        try {
            await addToCart(
                {
                    product_id: product.product_id,
                    product_name: product.product_name,

                    // Variant
                    variant_id: currentVariant.variant_id,
                    volume: currentVariant.volume,
                    packaging_type: currentVariant.packaging_type,
                    price: currentVariant.price,

                    // ✅ Batch FIFO backend đã chọn sẵn
                    batch_id: currentVariant.batch_id,

                    image_url: currentVariant.image_url || product.image_url,
                },
                quantity
            );
        } catch (err) {
            console.error("Add to cart failed:", err);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };





    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

    if (!product) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="bg-white dark:bg-background-dark font-display text-text-color">
            <div className="relative flex h-auto min-h-screen w-full flex-col">
                <Header />

                <section className="px-4 md:px-10 lg:px-40 py-5">
                    <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex justify-center py-5 mt-10">
                        <div className="flex flex-col max-w-[960px] flex-1">

                            <div className="flex flex-col lg:flex-row gap-8 mt-6">

                                <div className="w-full lg:w-1/2">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white rounded-xl min-h-80 shadow-lg transition-all duration-300"
                                        style={{ backgroundImage: `url(${currentVariant?.image_url || product.image_url})` }}
                                    ></div>
                                </div>

                                <div className="w-full lg:w-1/2 flex flex-col">
                                    <h1 className="text-[#333] dark:text-white text-[32px] font-bold">
                                        {product.product_name}
                                    </h1>

                                    <p className="text-[#333] dark:text-gray-300 py-3">
                                        {product.description}
                                    </p>

                                    <h2 className="text-[#333] dark:text-white text-[28px] font-bold pt-2">
                                        {currentVariant
                                            ? `${Number(currentVariant.price).toLocaleString("vi-VN")} VND`
                                            : "Vui lòng chọn loại"}
                                    </h2>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Số lượng còn: <span className="font-semibold">{currentVariant ? currentVariant.stock_quantity : 0}</span>
                                        {currentVariant && <span className="text-xs ml-2 text-gray-500">({currentVariant.packaging_type})</span>}
                                    </p>

                                    <div className="flex items-center gap-4 mt-6">
                                        <label className="text-[#333] dark:text-gray-300 font-medium">Số lượng:</label>
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                            <button onClick={decrease} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-12 text-center bg-transparent text-[#333] dark:text-white border-none focus:ring-0"
                                            />
                                            <button onClick={increase} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="text-[#333] dark:text-gray-300 font-medium block mb-2">Dung tích / Trọng lượng:</label>
                                        <div className="flex flex-wrap gap-3">
                                            {uniqueVolumes.map((vol) => (
                                                <button
                                                    key={vol}
                                                    onClick={() => handleVolumeChange(vol)}
                                                    className={`px-4 py-2 rounded-lg border transition-all duration-200 
                                                        ${selectedVolume === vol
                                                            ? "bg-primary text-white border-primary shadow-md"
                                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:border-primary"
                                                        }`}
                                                >
                                                    {vol}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-[#333] dark:text-gray-300 font-medium block mb-2">Quy cách:</label>
                                        <div className="flex flex-wrap gap-3">
                                            {availablePacks.length > 0 ? (
                                                availablePacks.map((pack) => (
                                                    <button
                                                        key={pack}
                                                        onClick={() => setSelectedPack(pack)}
                                                        className={`px-4 py-2 rounded-lg border transition-all duration-200
                                                            ${selectedPack === pack
                                                                ? "bg-primary text-white border-primary shadow-md"
                                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:border-primary"
                                                            }`}
                                                    >
                                                        {pack}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic text-sm">Vui lòng chọn dung tích trước</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAdd}
                                        disabled={!currentVariant || currentVariant.stock_quantity <= 0}
                                        className={`font-semibold py-3 px-6 rounded-lg mt-8 w-full lg:w-auto shadow-md transition-colors 
                                            ${(!currentVariant || currentVariant.stock_quantity <= 0)
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-primary text-white hover:bg-primary/90 active:scale-95"}`}
                                    >
                                        {(!currentVariant || currentVariant.stock_quantity <= 0) ? "Tạm hết hàng" : "Thêm vào giỏ hàng"}
                                    </button>
                                </div>
                            </div>

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

                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
}