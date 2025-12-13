import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function BestSellingProduct() {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm từ backend khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();

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

  // Điều hướng sang trang chi tiết sản phẩm khi click
  const handleClick = (product) => {
    navigate(`product-details/${product.product_id}`);
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {productList
        .filter(product => product.is_hot === 1 && product.quantity > 0)
        .slice(0, 3)
        .map((product) => (
          <div
            key={product.product_id}
            onClick={() => handleClick(product)}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('${product.image_url}')` }}
            ></div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-text-color text-xl font-bold">
                {product.product_name}
              </h3>

              <p className="text-gray-500 mt-1 flex-1">
                {product.description}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
