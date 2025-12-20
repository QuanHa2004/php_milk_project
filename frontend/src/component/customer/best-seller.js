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

        const json = await res.json();

        setProductList(Array.isArray(json.data) ? json.data : []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setProductList([]);
      }
    };

    fetchData();
  }, []);

  const handleClick = (product) => {
    navigate(`/product-details/${product.product_id}`);
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {productList
        .filter(product => product.is_hot === 1 && Number(product.total_quantity) > 0)
        .slice(0, 3)
        .map((product) => (
          <div
            key={product.product_id}
            onClick={() => handleClick(product)}
            className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#d32f2f] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Hot
              </span>
            </div>

            <div className="relative pt-[80%] overflow-hidden bg-white">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${product.image_url}')` }}
              ></div>
            </div>

            <div className="p-6 flex flex-col flex-1 text-center">
              <h3 className="text-[#1a3c7e] text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#4096ff] transition-colors">
                {product.product_name}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 h-10">
                {product.description}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                <span className="inline-block text-[#1a3c7e] font-bold text-sm uppercase tracking-wide group-hover:underline decoration-2 underline-offset-4">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
