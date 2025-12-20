import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ProductOption() {
  const { category_id } = useParams();
  const [categoriesList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Lấy dữ liệu tìm kiếm từ trang trước (nếu có)
  const location = useLocation();
  const searchResult = location.state?.result || null;
  // Lấy danh sách danh mục khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/categories");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();
        if (Array.isArray(data.data)) {
          setCategoryList(data.data);
        } else {
          setCategoryList([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setCategoryList([]);
      }
    };

    fetchData();
  }, []);

  // Lấy danh sách sản phẩm theo danh mục hoặc theo kết quả tìm kiếm
  useEffect(() => {
    if (searchResult) {
      setProducts(searchResult);
      return;
    }

    const url = category_id
      ? `http://localhost:8000/${category_id}/products`
      : `http://localhost:8000/products`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch(err => {
        console.error("Không có sản phẩm", err);
        setProducts([]);
      });
  }, [category_id, searchResult]);

  // Điều hướng sang trang chi tiết sản phẩm
  const handleClick = (product) => {
    navigate(`/product-details/${product.product_id}`);
  };


  // Chọn danh mục để lọc sản phẩm
  const clickCategory = (category_id) => {
    navigate(`/categories/${category_id}/products`);
  };

  return (
    <>
      <div className="fixed top-16 left-0 w-full z-40 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => navigate("/products")}
              className="text-[#1a3c7e] hover:bg-[#1a3c7e] hover:text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border border-transparent hover:shadow-md"
            >
              Tất cả
            </button>

            {categoriesList.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => clickCategory(cat.category_id)}
                className="text-gray-600 hover:text-[#1a3c7e] hover:bg-blue-50 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap"
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#f8f9fa] pt-12 px-4 md:px-10 lg:px-20 pb-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products
              .filter((product) => product.total_quantity > 0)
              .map((product) => (
                <div key={product.product_id} className="group h-full">
                  <div
                    onClick={() => handleClick(product)}
                    className="flex flex-col h-full bg-white rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative"
                  >
                    <div className="relative pt-[100%] overflow-hidden bg-white p-4">
                      <div
                        className="absolute inset-0 m-4 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${product.image_url}")` }}
                      ></div>
                    </div>

                    <div className="flex flex-col flex-grow p-5 text-center">
                      <h3 className="text-[#1a3c7e] text-base md:text-lg font-bold line-clamp-2 mb-2 group-hover:text-[#4096ff] transition-colors">
                        {product.product_name}
                      </h3>

                      <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-4 h-10 overflow-hidden">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <button className="w-full py-2.5 rounded-xl bg-white border border-[#1a3c7e] text-[#1a3c7e] text-sm font-bold group-hover:bg-[#1a3c7e] group-hover:text-white transition-all duration-300">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-[#1a3c7e] font-medium text-lg">
              Chưa có sản phẩm nào trong danh mục này
            </div>
          </div>
        )}
      </div>
    </>
  );
}
