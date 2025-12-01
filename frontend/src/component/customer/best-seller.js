import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import useCart from '../../context/cart-context';


export default function BestSellingProduct() {
  const [productList, setProductList] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();

        // kiem tra du lieu tra ve co phai mang hay khong 
        if (Array.isArray(data)) {
          setProductList(data);
        } else {
          setProductList([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setProductList([]);
      }
    };

    fetchData();
  }, []);


  const handleClick = (product) => {
    navigate(`product-details/${product.product_id}`)
  };


  const handleAdd = async (product, e) => {
    e.stopPropagation();
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {productList.slice(0, 3).map((product) => (
        <div onClick={() => handleClick(product)} className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
          <div
            className="w-full h-48 bg-cover bg-center"
            style={{ backgroundImage: `url('${product.imageUrl}')` }}
          ></div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-text-color text-xl font-bold">{product.product_name}</h3>
            <p className="text-gray-500 mt-1 flex-1">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-secondary">{Number(product.price).toLocaleString('vi-VN')} VND</span>
              <button onClick={(e) => handleAdd(product, e)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                Thêm
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
