import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    category_name: "", // Nên là category_id (dropdown) nhưng tạm thời để text theo yêu cầu
    manufacturer_name: "", // Tương tự, nên là manufacturer_id
    price: "",
    image_url: "",
    description: "",
    ingredients: "",
    usage_inst: "",
    storage_inst: "",
    nutrition_info: "",
    origin: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        navigate("/admin/product");
      } else {
        alert("Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">
          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-5xl mx-auto">

              <div className="flex flex-col gap-1 mb-8">
                <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                  Thêm sản phẩm mới
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  Nhập thông tin chi tiết để đăng bán sản phẩm.
                </p>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                  <div>
                    <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                      </span>
                      Thông tin cơ bản
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <label className="flex flex-col w-full gap-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Tên sản phẩm <span className="text-red-500">*</span></span>
                        <input name="product_name" value={formData.product_name} onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" placeholder="VD: Sữa tươi Vinamilk" />
                      </label>

                      <label className="flex flex-col w-full gap-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Danh mục</span>
                        <input name="category_name" value={formData.category_name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" placeholder="VD: Sữa tươi" />
                      </label>

                      <label className="flex flex-col w-full gap-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Nhà sản xuất</span>
                        <input name="manufacturer_name" value={formData.manufacturer_name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" placeholder="VD: Vinamilk" />
                      </label>

                      <label className="flex flex-col w-full gap-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Giá bán (VNĐ) <span className="text-red-500">*</span></span>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" placeholder="0" />
                      </label>

                      <label className="flex flex-col w-full gap-2 md:col-span-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Hình ảnh (URL)</span>
                        <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" placeholder="https://example.com/image.jpg" />
                      </label>

                      <label className="flex flex-col w-full gap-2 md:col-span-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">Mô tả sản phẩm</span>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 h-24 pt-3 resize-none" placeholder="Mô tả chi tiết..." />
                      </label>

                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100 dark:border-stone-700">
                    <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </span>
                      Thông tin chi tiết
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex flex-col gap-2"><span className="label-text">Thành phần</span><input name="ingredients" value={formData.ingredients} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" /></label>
                      <label className="flex flex-col gap-2"><span className="label-text">Hướng dẫn sử dụng</span><input name="usage_inst" value={formData.usage_inst} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" /></label>
                      <label className="flex flex-col gap-2"><span className="label-text">Cách bảo quản</span><input name="storage_inst" value={formData.storage_inst} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" /></label>
                      <label className="flex flex-col gap-2"><span className="label-text">Thông tin dinh dưỡng</span><input name="nutrition_info" value={formData.nutrition_info} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" /></label>
                      <label className="flex flex-col gap-2"><span className="label-text">Xuất xứ</span><input name="origin" value={formData.origin} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200" /></label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                    <button type="button" onClick={() => navigate(-1)} className="h-11 px-6 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors">Hủy bỏ</button>
                    <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-amber-900 text-white font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                      {isSubmitting ? "Đang lưu..." : "Thêm sản phẩm"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 {
          @apply w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200;
        }
        .label-text {
          @apply text-stone-700 dark:text-stone-300 text-sm font-semibold;
        }
      `}</style>
    </div>
  );
}