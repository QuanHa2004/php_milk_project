import { useNavigate } from "react-router-dom";

export default function Explore() {
  // Danh sách các danh mục hiển thị trên trang
  const categories = [
    {
      title: "SỮA TƯƠI",
      imageUrl: "https://th.bing.com/th/id/OSK.HEROYeXAVJkpUhbzwfZSLTVavNxcuAiBlYC11vqRLgZ8NqQ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      link: "/categories/1/products",
    },
    {
      title: "PHÔ MAI",
      imageUrl: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg",
      link: "/categories/2/products",
    },
    {
      title: "YOGURT",
      imageUrl: "https://images.pexels.com/photos/5945660/pexels-photo-5945660.jpeg",
      link: "/categories/3/products",
    },
  ];

  const navigate = useNavigate();

  // Xử lý khi người dùng click vào một danh mục
  const handleClick = (category) => {
    if (category.link) navigate(category.link);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center">
      {categories.map((category) => (
        <div
          key={category.title}
          onClick={() => handleClick(category)}
          className="flex flex-col justify-between bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group w-full max-w-sm"
        >
          <div
            className="h-48 bg-center bg-cover"
            style={{ backgroundImage: `url("${category.imageUrl}")` }}
          ></div>

          <div className="p-4 flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#111618] mb-2 text-center">
              {category.title}
            </h3>

            <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
              MUA NGAY
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
