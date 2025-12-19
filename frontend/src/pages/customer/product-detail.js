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

                                    {currentVariant && (
                                        <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                                            {currentVariant.variant_name}
                                        </p>
                                    )}

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
                                            <button
                                                onClick={decrease}
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
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
                                                className="w-12 text-center bg-transparent text-[#333] dark:text-white border-none focus:ring-0"
                                            />
                                            <button
                                                onClick={() => increase(currentVariant ? currentVariant.stock_quantity : 1)}
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                            >
                                                +
                                            </button>
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

                            <NutrientSection product={product} />

                            <ReviewSection
                                product_id={product_id}
                                currentVariant={currentVariant} />
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
}