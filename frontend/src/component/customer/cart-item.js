import useCart from "../../context/cart-context";

export default function CartItem() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    increase,
    decrease,
    setCartItems,
  } = useCart();

  const handleCheckboxChange = async (product_id, is_checked) => {
    const newIsChecked = !is_checked;

    setCartItems(prev =>
      prev.map(item =>
        item.product_id === product_id
          ? { ...item, is_checked: newIsChecked } 
          : item
      )
    );

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/carts/${product_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_checked: newIsChecked }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);

      setCartItems(prev =>
        prev.map(item =>
          item.product_id === product_id
            ? { ...item, is_checked: is_checked }
            : item
        )
      );
      alert("Không thể cập nhật trạng thái sản phẩm!");
    }
  };


  return (
    <>
      {cartItems.map((product, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={product.is_checked || false}
              onChange={() => handleCheckboxChange(product.product_id, product.is_checked)}
              className="w-5 h-5 accent-[#8b4513] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 col-span-1 md:col-span-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20"
              style={{ backgroundImage: `url("${product.image_url}")` }}
            />
            <div className="flex flex-col justify-center">
              <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                {product.product_name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>

          <div className="text-center text-gray-900 dark:text-white">
            {Number(product.price).toLocaleString("vi-VN")} VND
          </div>

          <div className="flex justify-center items-center gap-2 text-gray-900 dark:text-white">
            <button onClick={() => decrease(product.product_id)}>-</button>
            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) =>
                updateQuantity(product.product_id, parseInt(e.target.value) || 1)
              }
              className="w-10 text-center bg-transparent"
            />
            <button onClick={() => increase(product.product_id)}>+</button>
          </div>

          <div className="text-right text-gray-900 dark:text-white font-semibold">
            {(product.price * product.quantity).toLocaleString("vi-VN")} VND
          </div>

          <div className="col-span-full md:col-span-1 flex justify-end md:justify-center">
            <button
              onClick={() => removeFromCart(product.product_id)}
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