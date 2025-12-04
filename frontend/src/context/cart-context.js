import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export default function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Lay du lieu gio hang trong localStorage neu co
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // moi khi token thay doi, re-reder de lay du lieu moi nhat
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchCartItems(token);
      syncLocalCartToBackend(token);
    }
  }, [token]);

  const updateToken = (newToken) => {
    setToken(newToken);
  }

  const logOut = () => {
    setCartItems([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("cart");
  };

  // Lay gio hang cua nguoi dung hien tai
  const fetchCartItems = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/carts/current_user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Thất bại");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
      setCartItems([]);
    }
  };

  // Dong bo du lieu gio hang cua khach hang vang lai sau khi dang nhap
  const syncLocalCartToBackend = async (token) => {
    if (!token)
      return;

    const localCart = localStorage.getItem("cart");
    if (!localCart) return;

    const cartData = JSON.parse(localCart);
    for (const item of cartData) {
      await addToCart(
        { product_id: item.product_id, price: item.price, is_checked: item.is_checked ?? false },
        item.quantity
      );
    }
    localStorage.removeItem("cart");
  };

  const addToCart = async (product, quantity) => {

    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(i => i.product_id === product.product_id);
      if (existingItem) existingItem.quantity += quantity;
      else
        cart.push({
          product_id: product.product_id,
          product_name: product.product_name,
          description: product.description,
          image_url: product.imageUrl,
          price: product.price,
          quantity,
          is_checked: false,
        });
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart); // react khong biet localStorage da thay doi, phai su dung state de re-render lai UI
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity,
          is_checked: false,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm sản phẩm");
      await fetchCartItems(token);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (product_id) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(item => item.product_id !== product_id);
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/carts/remove/${product_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể xóa sản phẩm");
      setCartItems(prev => prev.filter(item => item.product_id !== product_id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (product_id, quantity) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(item => item.product_id === product_id);
      if (existingItem) existingItem.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/carts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id, quantity }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật số lượng sản phẩm");
      setCartItems(prev =>
        prev.map(item => (item.product_id === product_id ? { ...item, quantity } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const increase = product_id => {
    const item = cartItems.find(p => p.product_id === product_id);
    if (item) updateQuantity(product_id, item.quantity + 1);
  };

  const decrease = product_id => {
    const item = cartItems.find(p => p.product_id === product_id);
    if (item && item.quantity > 1) updateQuantity(product_id, item.quantity - 1);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        logOut,
        updateToken,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increase,
        decrease,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
