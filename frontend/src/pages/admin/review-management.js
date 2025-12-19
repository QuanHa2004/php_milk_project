import SideBar from "../../component/admin/side-bar";
import ReviewList from "../../component/admin/review-list";

export default function ReviewManagement() {

  return (
    <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">

          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-7xl mx-auto">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                    Quản lý đánh giá
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Kiểm soát đánh giá của khách hàng
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex flex-col min-w-40 h-12 w-full max-w-lg">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 overflow-hidden">

                    <div className="text-stone-400 flex items-center justify-center pl-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>

                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-700 dark:text-stone-200 focus:outline-0 border-none bg-transparent h-full placeholder:text-stone-400 px-3 text-base font-normal leading-normal"
                      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    />
                  </div>
                </label>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                <ReviewList />
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}