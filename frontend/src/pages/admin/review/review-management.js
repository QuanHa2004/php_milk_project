import SideBar from "../../../component/side-bar";
import ReviewList from "./review-list";

export default function ReviewManagement() {

  return (
    <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">

          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-7xl mx-auto">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                    Quản lý đánh giá
                  </p>
                  <p className="text-gray-500 text-sm">
                    Kiểm soát phản hồi và đánh giá từ khách hàng.
                  </p>
                </div>
              </div>

              <div className="mb-6 w-full max-w-sm">
                <label className="flex flex-col min-w-40 h-11 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#1a3c7e] overflow-hidden">

                    <div className="text-gray-400 flex items-center justify-center pl-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>

                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#333] focus:outline-0 border-none bg-transparent h-full placeholder:text-gray-400 px-3 text-sm font-medium leading-normal"
                      placeholder="Tìm kiếm đánh giá..."
                    />
                  </div>
                </label>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <ReviewList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}