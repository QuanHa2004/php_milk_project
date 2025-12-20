import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import Header from "../../component/customer/header";
import Footer from "../../component/customer/footer";
import useCart from "../../context/cart-context";
import ReviewSection from "../../component/customer/review-section";
import NutrientSection from "../../component/customer/nutrient-section";

export default function ProductDetail() {
    const { product_id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);


    const [selectedVolume, setSelectedVolume] = useState(null);
    const [selectedPack, setSelectedPack] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/products/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);

                if (data.variants && data.variants.length > 0) {
                    const firstVariant = data.variants[0];
                    setSelectedVolume(firstVariant.volume);
                    setSelectedPack(firstVariant.packaging_type);
                }
            })
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, [product_id]);

    const uniqueVolumes = useMemo(() => {
        if (!product?.variants) return [];
        return [...new Set(product.variants.map(v => v.volume))];
    }, [product]);

    const availablePacks = useMemo(() => {
        if (!product?.variants || !selectedVolume) return [];
        return product.variants
            .filter(v => v.volume === selectedVolume)
            .map(v => v.packaging_type);
    }, [product, selectedVolume]);

    const currentVariant = useMemo(() => {
        if (!product?.variants) return null;
        return product.variants.find(
            v => v.volume === selectedVolume && v.packaging_type === selectedPack
        );
    }, [product, selectedVolume, selectedPack]);


    const handleVolumeChange = (newVolume) => {
        setSelectedVolume(newVolume);

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
                    variant_id: currentVariant.variant_id,
                    volume: currentVariant.volume,
                    packaging_type: currentVariant.packaging_type,
                    price: currentVariant.price,
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

    const increase = (maxStock) => {
        setQuantity((prev) => Math.min(prev + 1, maxStock || 1));
    };
    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

    if (!product) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="bg-white font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">
                        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                            <div className="w-full lg:w-1/2">
                                <div className="relative w-full pt-[100%] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                    <div
                                        className="absolute inset-0 bg-center bg-no-repeat bg-contain m-8 transition-transform duration-500 hover:scale-105"
                                        style={{ backgroundImage: `url(${currentVariant?.image_url || product.image_url})` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 flex flex-col">
                                <h1 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold leading-tight mb-2">
                                    {product.product_name}
                                </h1>

                                {currentVariant && (
                                    <div className="mb-4">
                                        <span className="inline-block bg-blue-50 text-[#1a3c7e] text-sm font-semibold px-3 py-1 rounded-full">
                                            {currentVariant.variant_name}
                                        </span>
                                    </div>
                                )}

                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-[#d32f2f] text-3xl font-bold">
                                            {currentVariant
                                                ? `${Number(currentVariant.price).toLocaleString("vi-VN")}₫`
                                                : "Liên hệ"}
                                        </h2>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Tình trạng:
                                        <span className={`font-semibold ml-1 ${currentVariant && currentVariant.stock_quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {currentVariant && currentVariant.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                        </span>
                                        {currentVariant && <span className="text-gray-400 ml-1">({currentVariant.stock_quantity} sản phẩm)</span>}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[#1a3c7e] font-bold text-sm uppercase block mb-3">Dung tích</label>
                                        <div className="flex flex-wrap gap-3">
                                            {uniqueVolumes.map((vol) => (
                                                <button
                                                    key={vol}
                                                    onClick={() => handleVolumeChange(vol)}
                                                    className={`min-w-[80px] px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200 
                            ${selectedVolume === vol
                                                            ? "bg-[#1a3c7e] text-white border-[#1a3c7e] shadow-md transform -translate-y-0.5"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3c7e] hover:text-[#1a3c7e]"
                                                        }`}
                                                >
                                                    {vol}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[#1a3c7e] font-bold text-sm uppercase block mb-3">Quy cách</label>
                                        <div className="flex flex-wrap gap-3">
                                            {availablePacks.length > 0 ? (
                                                availablePacks.map((pack) => (
                                                    <button
                                                        key={pack}
                                                        onClick={() => setSelectedPack(pack)}
                                                        className={`min-w-[80px] px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200
                              ${selectedPack === pack
                                                                ? "bg-[#1a3c7e] text-white border-[#1a3c7e] shadow-md transform -translate-y-0.5"
                                                                : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3c7e] hover:text-[#1a3c7e]"
                                                            }`}
                                                    >
                                                        {pack}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Vui lòng chọn dung tích</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 mt-6">
                                        <div className="flex items-center">
                                            <label className="text-[#1a3c7e] font-bold text-sm mr-4 hidden sm:block">SỐ LƯỢNG</label>
                                            <div className="flex items-center border border-gray-300 rounded-lg h-12">
                                                <button
                                                    onClick={decrease}
                                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1a3c7e] hover:bg-gray-50 rounded-l-lg transition-colors text-xl font-medium"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={currentVariant ? currentVariant.stock_quantity : 1}
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1;
                                                        setQuantity(Math.min(Math.max(1, val), currentVariant ? currentVariant.stock_quantity : 1));
                                                    }}
                                                    className="w-14 h-full text-center border-none focus:ring-0 text-[#1a3c7e] font-bold text-lg bg-transparent p-0"
                                                />
                                                <button
                                                    onClick={() => increase(currentVariant ? currentVariant.stock_quantity : 1)}
                                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1a3c7e] hover:bg-gray-50 rounded-r-lg transition-colors text-xl font-medium"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAdd}
                                            disabled={!currentVariant || currentVariant.stock_quantity <= 0}
                                            className={`flex-1 h-12 rounded-full font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
                        ${(!currentVariant || currentVariant.stock_quantity <= 0)
                                                    ? "bg-gray-300 text-white cursor-not-allowed shadow-none"
                                                    : "bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-white hover:shadow-blue-200"}`}
                                        >
                                            {(!currentVariant || currentVariant.stock_quantity <= 0) ? "Tạm hết hàng" : "Thêm vào giỏ"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-10">
                            <NutrientSection product={product} />
                        </div>

                        <div className="mt-10 bg-[#f8f9fa] rounded-2xl p-6 md:p-10">
                            <ReviewSection
                                product_id={product_id}
                                currentVariant={currentVariant} />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}