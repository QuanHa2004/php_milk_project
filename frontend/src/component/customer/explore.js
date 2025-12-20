import { useNavigate } from "react-router-dom";

export default function Explore() {
  // Danh sách các danh mục hiển thị trên trang
  const categories = [
    {
      title: "SỮA HẠT",
      imageUrl: "/images/sua-hat.png",
      link: "/categories/1/products",
    },
    {
      title: "SỮA ĐẶC",
      imageUrl: "/images/sua-dac.png",
      link: "/categories/2/products",
    },
    {
      title: "SỮA CHUA",
      imageUrl: "/images/sua-chua.png",
      link: "/categories/3/products",
    },
  ];

  const navigate = useNavigate();

  // Xử lý khi người dùng click vào một danh mục
  const handleClick = (category) => {
    if (category.link) navigate(category.link);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {categories.map((category) => (
        <div
          key={category.title}
          onClick={() => handleClick(category)}
          className="group relative flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgb(0,0,0,0.15)]"
        >
          <div className="relative pt-[75%] overflow-hidden bg-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url("${category.imageUrl}")` }}
            ></div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end h-1/2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide text-center mb-2 drop-shadow-md">
              {category.title}
            </h3>

            <button className="mt-2 px-6 py-2 bg-white text-[#1a3c7e] rounded-full text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-blue-50">
              Mua ngay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
