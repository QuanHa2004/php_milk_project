import SideBar from "../../component/admin/side-bar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [recentPromotionList, setRecentPromotionList] = useState([]);
  const [report, setReport] = useState({
    total_revenue: 0,
    total_orders: 0,
    new_customer: 0,
    avg_value: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // chi nhan du lieu khong xu ly phuc tap
  useEffect(() => {
    fetch("http://localhost:8000/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, []);

  // xu ly du lieu duoc tra ve
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/promotions");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();

        // kiem tra du lieu tra ve co phai mang hay khong 
        if (Array.isArray(data)) {
          setRecentPromotionList(data.slice(0, 5));
        } else {
          setRecentPromotionList([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setRecentPromotionList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0">
        <SideBar />
      </div>

      <main className="flex-1 p-8 w-full overflow-hidden">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">

          <div className="flex min-w-72 flex-col gap-1">
            <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
              Bảng điều khiển
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Tổng quan tình hình kinh doanh tháng này.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">            
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Tổng doanh thu
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.total_revenue).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Tổng đơn hàng
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.total_orders).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Khách hàng mới
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.new_customer).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Giá trị trung bình/đơn
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.avg_value).toLocaleString('vi-VN')} 
                </h3>
              </div>
            </div>

          </div>

          <div className="w-full bg-white dark:bg-[#292524] rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden flex flex-col">

            <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  Mã giảm giá mới
                </h2>
              </div>
              <button className="text-sm text-amber-700 font-medium hover:text-amber-900 hover:underline transition-colors">
                Xem tất cả
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-amber-50/50 dark:bg-stone-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400">
                      Mã Code
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400">
                      Bắt đầu
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400">
                      Kết thúc
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-700 bg-white dark:bg-[#292524]">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-stone-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : recentPromotionList.length > 0 ? (
                    recentPromotionList.map((promotion, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 select-all">
                            {promotion.promo_code}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-600 dark:text-stone-300">
                          <div className="flex items-center gap-2">
                            {new Date(promotion.start_date).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-600 dark:text-stone-300">
                          {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {promotion.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-stone-100 text-stone-500 border-stone-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                              Đã ngưng
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm font-medium text-stone-500">
                            Chưa có mã giảm giá nào
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}