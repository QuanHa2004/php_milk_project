import { useEffect, useState } from "react";
import useCart from "../../context/cart-context";

export default function CartItem() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    increase,
    decrease,
    setCartItems,
    fetchCartItems,
  } = useCart();

  console.log("Cart items:", cartItems);

  const token = localStorage.getItem("access_token");
  const [checkAll, setCheckAll] = useState(false);

  // -- State Effects ----------------------------------------------------
  // Update `checkAll` when cart items change
  useEffect(() => {
    setCheckAll(cartItems.length > 0 && cartItems.every(item => item.is_checked));
  }, [cartItems]);

  // -- Cart update handlers ---------------------------------------------
  // Update a single cart item's checked status (guest or API)
  const updateItemStatus = async (variant_id, is_checked) => {
    try {
      // Guest mode
      if (!token) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart = cart.map(item =>
          item.variant_id === variant_id
            ? { ...item, is_checked }
            : item
        );

        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems(cart);
        return;
      }

      const res = await fetch(`http://localhost:8000/carts/${variant_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_checked }),
      });

      if (!res.ok) throw new Error("Lỗi cập nhật trạng thái sản phẩm");

      return await res.json();

    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật trạng thái sản phẩm!");
      fetchCartItems();
    }
  };

  // Toggle select/deselect all cart items
  const handleCheckboxAll = () => {
    const newIsChecked = !cartItems.every(item => item.is_checked);

    const updated = cartItems.map(item => ({ ...item, is_checked: newIsChecked }));
    setCartItems(updated);

    updated.forEach(item => updateItemStatus(item.variant_id, newIsChecked));
  };

  // Toggle select/deselect a single cart item
  const handleCheckboxChange = (variant_id, is_checked) => {
    const newIsChecked = !is_checked;

    setCartItems(prev =>
      prev.map(item =>
        item.variant_id === variant_id
          ? { ...item, is_checked: newIsChecked }
          : item
      )
    );

    updateItemStatus(variant_id, newIsChecked);
  };

  return (
    <>
      <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 items-center">
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#8b4513] cursor-pointer"
            checked={checkAll}
            onChange={handleCheckboxAll}
          />
        </div>
        <div className="col-span-3 text-center">Sản phẩm</div>
        <div className="text-center">Giá</div>
        <div className="text-center">Số lượng</div>
        <div className="text-center">Tổng cộng</div>
      </div>

      {cartItems.map((product, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={product.is_checked || false}
              onChange={() => handleCheckboxChange(product.variant_id, product.is_checked)}
              className="w-5 h-5 accent-[#8b4513] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 col-span-1 md:col-span-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20"
              style={{ backgroundImage: `url("${product.image_url}")` }}
            />
            <div>
              {/* TÊN SẢN PHẨM */}
              <p className="text-gray-900 dark:text-white font-medium">
                {product.product_name}
              </p>

              {/* QUY CÁCH + DUNG TÍCH */}
              {(product.packaging_type || product.volume) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {product.packaging_type}
                  {product.packaging_type && product.volume && (
                    <span className="mx-1">·</span>
                  )}
                  {product.volume}
                </p>
              )}
            </div>

          </div>

          <div className="text-center text-gray-900 dark:text-white">
            {Number(product.price).toLocaleString("vi-VN")} VND
          </div>

          <div className="flex justify-center items-center gap-2 text-gray-900 dark:text-white">
            <button onClick={() => decrease(product.variant_id, product.batch_id)}>-</button>
            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) =>
                updateQuantity(product.variant_id, parseInt(e.target.value) || 1)
              }
              className="w-10 text-center bg-transparent"
            />
            <button onClick={() => increase(product.variant_id, product.batch_id)}>+</button>
          </div>

          <div className="text-right text-gray-900 dark:text-white font-semibold">
            {(product.price * product.quantity).toLocaleString("vi-VN")} VND
          </div>

          <div className="col-span-full md:col-span-1 flex justify-end md:justify-center">
            <button
              onClick={() => removeFromCart(product.variant_id, product.batch_id)}
              className="text-gray-500 hover:text-red-500"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
