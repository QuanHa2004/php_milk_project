import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import useCart from '../../context/cart-context';

export default function ProductDetail() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`http://localhost:8000/products/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
            });
    }, [product_id]);

    const handleAdd = async (e) => {
        e.stopPropagation();
        try {
            await addToCart(product, quantity);
        } catch (err) {
            console.error(err);
        }
    };

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

    if (!product) return <div>Loading...</div>;
    return (
        <div class="bg-white dark:bg-background-dark font-display text-text-color">
            <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div class="layout-container flex h-full grow flex-col">
                    <Header />
                    <section class="px-4 md:px-10 lg:px-40 py-5">
                        <div class="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 mt-10">
                            <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
                                <div class="flex flex-col lg:flex-row gap-8 mt-6">
                                    <div class="w-full lg:w-1/2">
                                        <div class="bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white rounded-xl min-h-80 shadow-lg"
                                            data-alt="A glass bottle of organic whole milk with a light green label, sitting on a rustic wooden table."
                                            style={{ backgroundImage: `url(${product.image_url})` }}>
                                        </div>
                                    </div>
                                    <div class="w-full lg:w-1/2 flex flex-col">
                                        <h1
                                            class="text-[#333333] dark:text-white tracking-light text-[32px] font-bold leading-tight">
                                            {product.product_name}</h1>
                                        <p class="text-[#333333] dark:text-gray-300 text-base font-normal leading-normal py-3">
                                            {product.description}
                                        </p>
                                        <h2
                                            class="text-[#333333] dark:text-white tracking-light text-[28px] font-bold leading-tight pt-2">
                                            {Number(product.price).toLocaleString('vi-VN')} VND</h2>
                                        <div class="flex items-center gap-4 mt-6">
                                            <label class="text-[#333333] dark:text-gray-300" for="quantity">Quantity:</label>
                                            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                <button onClick={() => decrease()}
                                                    class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg">
                                                    <span class="material-symbols-outlined text-base">remove</span>
                                                </button>
                                                <input
                                                    id="quantity"
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                                    }
                                                    className="w-12 text-center border-0 bg-transparent text-[#333333] dark:text-white focus:ring-0"
                                                />
                                                <button onClick={() => increase()}
                                                    class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg">
                                                    <span class="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={(e) => handleAdd(e)}
                                            class="bg-primary text-white font-semibold py-3 px-6 rounded-lg mt-6 w-full lg:w-auto hover:bg-primary/90 transition-colors duration-300 shadow-md">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                {/* <div class="mt-12">
                                <h3
                                    class="text-[#333333] dark:text-white text-xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
                                    Product Details</h3>
                                <div class="text-[#333333] dark:text-gray-300 space-y-4">
                                    <p>From happy cows on our family-owned farm, our milk is a testament to quality and care. We
                                        believe in sustainable practices that are good for our cows, our land, and your family.
                                    </p>
                                    <ul class="list-disc list-inside space-y-2">
                                        <li>Certified Organic</li>
                                        <li>From Grass-fed Cows</li>
                                        <li>Gently Pasteurized</li>
                                        <li>Non-GMO</li>
                                    </ul>
                                    <h4 class="text-[#333333] dark:text-white text-lg font-semibold pt-4">Nutritional
                                        Information</h4>
                                    <div class="overflow-x-auto">
                                        <table class="w-full text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th class="border-b dark:border-gray-700 p-2">Nutrient</th>
                                                    <th class="border-b dark:border-gray-700 p-2">Amount per serving</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="border-b dark:border-gray-700 p-2">Calories</td>
                                                    <td class="border-b dark:border-gray-700 p-2">150</td>
                                                </tr>
                                                <tr>
                                                    <td class="border-b dark:border-gray-700 p-2">Total Fat</td>
                                                    <td class="border-b dark:border-gray-700 p-2">8g</td>
                                                </tr>
                                                <tr>
                                                    <td class="border-b dark:border-gray-700 p-2">Protein</td>
                                                    <td class="border-b dark:border-gray-700 p-2">8g</td>
                                                </tr>
                                                <tr>
                                                    <td class="p-2">Calcium</td>
                                                    <td class="p-2">30% DV</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}